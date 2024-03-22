/* eslint-disable no-param-reassign */
import { Server as SKServer } from 'socket.io';
import { Server } from 'http';
import redis from '@configs/redis/index';
import jwt from '@src/api/v1/utils/jwt';
import { ExtendedError } from 'socket.io/dist/namespace';
import { ISocket, ISocketLogin } from './index.interface';
import { corsOptions } from '../cors';
import { UnauthorizedHTTP } from '../httpException';
import logger from '../logger';

class SocketServer extends SKServer {
  public redis_client: typeof redis;

  constructor() {
    super();
    this.redis_client = redis;
  }

  public attach(httpServer: Server) {
    super.attach(httpServer, {
      cors: corsOptions,
    });
    this.use(this.auth);
    this.on('connection', this.connection);
    logger.log('Socket server started');
    return this;
  }

  private auth = (socket: ISocket, next: (err?: ExtendedError) => void) => {
    const { token } = socket.handshake.auth;
    if (token) {
      const { user_id } = jwt.verifyAccessToken(token) as { user_id: string };
      if (user_id) {
        socket.user_id = user_id;
        next();
      } else {
        next(new UnauthorizedHTTP());
      }
    } else {
      next(new UnauthorizedHTTP());
    }
  };

  private connection = async (socket: ISocket) => {
    logger.log(`socket connected id: ${socket.id}`);

    socket.on('login', async (data: ISocketLogin) => {
      logger.log(`Socket Login: ${data}`);
      await this.redis_client.set(`${data.user_id}`, socket.id);
    });

    socket.on('disconnect', async () => {
      logger.log(`socket disconnected id: ${socket.id}`);
      await this.redis_client.del('user_id');
    });
  };
}

export default new SocketServer();
