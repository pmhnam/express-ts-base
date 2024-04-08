import express, { Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import routerV1 from '@apiV1/modules/index';
import { corsOptions } from '@configs/cors';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV } from '@src/utils/constants/enum';
import ResponseHandler from '../middlewares/response.middleware';
import { errorHandler, notFoundHandler } from '../middlewares/error.middleware';
import { apiLimiter } from '../rateLimit';
import { accessLogsMiddleware } from '../middlewares/morgan.middleware';
import i18nMiddleware from '../i18n';
import apiDocs from '../swagger/index.json';

config();

const app = express();

if (process.env.NODE_ENV === NODE_ENV.DEVELOPMENT) {
  app.use(morgan('dev'));
} else {
  app.use(accessLogsMiddleware);
}
app.use(i18nMiddleware);
app.disable('x-powered-by');
app.use(compression());
app.use(cors(corsOptions));
app.use(helmet());
app.use(apiLimiter);
app.use(express.json({ limit: '10mb' }), express.urlencoded({ limit: '10mb', extended: true }));
app.use(ResponseHandler.middlewareResponse);

app.use('/static', express.static(path.join(__dirname, 'public'))); // serve static files
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Express with typescript code base server' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

app.use('/api/v1', routerV1);
app.use(errorHandler);
app.use('*', notFoundHandler);

export default app;
