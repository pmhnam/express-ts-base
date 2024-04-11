import app from '@express';
import io from '@configs/socket.io';
import { syncDatabase } from '@db/sequelize';
import { config } from 'dotenv';
config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await syncDatabase();
});

io.attach(server);
global.io = io;
