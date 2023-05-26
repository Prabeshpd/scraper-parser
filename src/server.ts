import config from './config';
import Queue from './utils/queue';

import { storeTagCsv, ParseTagParams } from './utils/csvParser';

const processEnv = config.env;
const connectionParameter = config.rabbitMQ[processEnv];
const queue = new Queue(connectionParameter);

async function sendQueueMessage(queueName: string, message: string) {
  const channel = await queue.createChannel();
  if (!channel) {
    throw new Error('Rabbit MQ not set properly');
  }
  await queue.assertQueue(channel, queueName);
  await queue.sendMessage(channel, queueName, message);
}

async function startConnection() {
  try {
    const connection = await queue.createConnection();

    queue.bindConnection(connection);
    const channel = await queue.createChannel();

    if (!channel) {
      throw new Error('Rabbit MQ not set properly');
    }

    await queue.assertQueue(channel, 'UploadedFile');

    channel.consume('UploadedFile', async (message) => {
      if (!message?.content) return;
      const data = (await JSON.parse(message?.content.toString())) as ParseTagParams;
      await storeTagCsv(data);
      await sendQueueMessage('SearchResult', JSON.stringify({ userId: data.userId }));
      channel.ack(message);
    });
  } catch (err) {
    console.log(err);
  }
}

startConnection();
