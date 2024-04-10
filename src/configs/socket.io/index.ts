import { Server as SKServer } from 'socket.io';
import { Server } from 'http';
import { ExtendedError } from 'socket.io/dist/namespace';
import { config } from 'dotenv';
import { IDisconnectDto, ISocket } from './index.interface';
import { corsOptions } from '../cors';
import { UnauthorizedHTTP } from '../httpException';
import logger from '../logger';
import redis from '../database/redis';
import jwt from '../jwt';

config();

class SocketServer extends SKServer {
  public redisClient: typeof redis;
  public socketPrefix = 'socket-';
  public events = {
    connection: 'connection',
    disconnect: 'disconnect',
    message: 'message',
  };

  constructor() {
    super();
    this.redisClient = redis;
    this.clearSocketKeys();
  }

  public attach(httpServer: Server) {
    super.attach(httpServer, {
      cors: corsOptions,
    });
    this.use(this.auth);
    this.on(this.events.connection, this.connection);
    logger.log('Socket server started');
    return this;
  }

  private auth = (socket: ISocket, next: (err?: ExtendedError) => void) => {
    const { token } = socket.handshake.auth;
    if (!token) next(new UnauthorizedHTTP());

    const { user_id } = jwt.verifyAccessToken(token) as { user_id: string };
    if (!user_id) next(new UnauthorizedHTTP());

    // eslint-disable-next-line no-param-reassign
    socket.user_id = user_id;
    next();
  };

  private connection = async (socket: ISocket) => {
    const { id, user_id } = socket;
    if (!user_id) return;

    const key = `${this.socketPrefix}${user_id}`;
    await this.redisClient.sadd(key, id);

    socket.on(this.events.disconnect, this.disconnect({ user_id, id }));
    socket.on(this.events.message, this.onMessage(socket));

    logger.log(`socket connected: ${id}`, { metadata: { user_id } });
  };

  private disconnect = ({ user_id, id }: IDisconnectDto) => {
    return async () => {
      const key = `${this.socketPrefix}${user_id}`;
      await this.redisClient.srem(key, id);
      const count = await this.redisClient.scard(key);
      if (count === 0) {
        await this.redisClient.del(key);
      }

      logger.log(`socket disconnected: ${id}`, { metadata: { user_id } });
    };
  };

  private clearSocketKeys = async () => {
    const keys = await this.redisClient.keys(`${this.socketPrefix}*`);
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  };

  private onMessage = (socket: ISocket) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (data: any) => {
      console.log('received', data);
      socket.to(data.socketId).emit('message', { response: 'received successfully' });
    };
  };
}

export default new SocketServer();
