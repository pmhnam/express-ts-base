import io from '@configs/socket.io';
import app from './configs/express';
import { ConnectMongoDB } from './configs/database';

const server = app.listen();

io.attach(server);
global.io = io;
