import { Socket } from 'socket.io';

export interface ISocketLogin {
  user_id: string;
}

export interface ISocket extends Socket {
  user_id?: string;
}

export interface IDisconnectDto {
  user_id: string;
  id: string;
}
