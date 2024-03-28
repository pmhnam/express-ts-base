import io from '@configs/socket.io';
import app from './configs/express';
import { connectDB } from './configs/database';

const server = app.listen(3000, async () => {
  console.log('Server running on port 3000');
  await connectDB();
});

io.attach(server);
global.io = io;
