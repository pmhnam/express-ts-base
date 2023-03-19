import amqplib, { Connection, ConsumeMessage, Replies } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

class MessageQueue {
  public connection!: Connection;
  public limit = 0;
  constructor() {
    this.initConnection();
  }

  // tạo kết nối đến RabbitMQ
  public async initConnection(): Promise<Connection> {
    const conn = await amqplib.connect(process.env.AMQP_CONNECTION || '');
    if (!conn) {
      throw new Error('Cannot connect to RabbitMQ');
    }
    this.connection = conn;
    process.once('SIGINT', () => {
      if (this.connection) {
        this.connection
          .close()
          .then(() => {
            console.log('> Publisher connection closed');
          })
          .catch((err) => {
            console.error('> Publisher connection error', err);
          });
      }
    });
    return conn;
  }

  // thêm một consumer vào queue
  public async addQueueConsumer(
    queue: string,
    callback: (arg0: ConsumeMessage) => Promise<object>
  ): Promise<Replies.Empty> {
    if (!this.connection || this.connection === ({} as Connection)) {
      await this.initConnection();
    }
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    const result = channel.prefetch(1);
    const doWork = async (msg: any) => {
      try {
        const response = await callback(msg);
        channel.ack(msg as ConsumeMessage);
        // split this line into func with sendToQueue as string or array
        this.sendToQueue(queue, Buffer.from(JSON.stringify(response)));
        console.log('> Message processed:', JSON.parse((msg as ConsumeMessage).content.toString()));
      } catch (error) {
        console.error('> Error processing message', error);
        channel.nack(msg as ConsumeMessage, true, false);
      }
    };
    channel.consume(
      queue,
      // eslint-disable-next-line consistent-return
      async (msg): Promise<void> => {
        if (msg) {
          return callback(msg)
            .then((response) => {
              channel.ack(msg as ConsumeMessage);
              // split this line into func with sendToQueue as string or array
              this.sendToQueue(queue, Buffer.from(JSON.stringify(response)));
              console.log('> Message processed:', JSON.parse((msg as ConsumeMessage).content.toString()));
            })
            .catch((error) => {
              console.error('> Error processing message', error);
              channel.nack(msg as ConsumeMessage, true, false);
            });
        }
        console.log('no message');
      },
      { noAck: false }
    );
    console.log('> Queue consumer added:', queue);
    return result;
  }

  public async sendToQueue(queue: string, message: string | object) {
    if (!this.connection) {
      await this.initConnection();
    }
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { deliveryMode: true });
    return channel.close().then(() => {
      console.log('> Channel closed ===================');
    });
  }
}

export default new MessageQueue();
