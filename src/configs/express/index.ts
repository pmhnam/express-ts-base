import express, { Application, Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import routerV1 from '@apiV1/modules/index';
import { corsOptions } from '@configs/cors';
import { config } from 'dotenv';
import ResponseHandler from '../middlewares/response.middleware';
import { errorHandler, notFoundHandler } from '../middlewares/error.middleware';
import { apiLimiter } from '../rateLimit';
import { accessLogsMiddleware } from '../middlewares/morgan.middleware';
import i18nMiddleware from '../i18n';
import { connectDB } from '../database';

config();

enum NODE_ENV {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

class App {
  public app: Application;
  public NODE_ENV: string = process.env.NODE_ENV || NODE_ENV.DEVELOPMENT;
  public PORT = process.env.PORT || 3000;

  constructor() {
    this.app = express();
    this.initConfig();
    this.initRoutes();
  }

  public listen(callback?: () => void) {
    return this.app.listen(this.PORT, async () => {
      await connectDB();
      console.log(`> Server started on port ${this.PORT}`);
      if (callback) callback();
    });
  }

  private initConfig() {
    if (this.NODE_ENV === NODE_ENV.DEVELOPMENT) {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(accessLogsMiddleware);
    }
    this.app.disable('x-powered-by');
    this.app.use(compression());
    this.app.use(cors(corsOptions));
    this.app.use(helmet());
    this.app.use(apiLimiter);
    this.app.use(express.json({ limit: '10mb' }), express.urlencoded({ limit: '10mb', extended: true }));
    this.app.use(i18nMiddleware);
    this.app.use(ResponseHandler.middlewareResponse);
  }

  private initRoutes() {
    this.app.use('/static', express.static(path.join(__dirname, 'public'))); // serve static files
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).json({ message: 'Express with typescript code base server' });
    });

    this.app.use('/api/v1', routerV1);
    this.app.use(errorHandler);
    this.app.use('*', notFoundHandler);
  }
}

export default new App();
