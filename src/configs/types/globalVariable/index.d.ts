/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import { Server as SKServer } from 'socket.io';

declare global {
  var io: SKServer;
}

export {};
