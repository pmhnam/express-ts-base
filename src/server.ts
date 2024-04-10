import io from '@configs/socket.io';
import app from '@express';
import { syncDatabase } from '@database/sequelize';

const server = app.listen(3000, async () => {
  console.log('Server running on port 3000');
  await syncDatabase();
});

io.attach(server);
global.io = io;
