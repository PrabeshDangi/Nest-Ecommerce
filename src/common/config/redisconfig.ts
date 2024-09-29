import { createClient } from 'redis';

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: parseInt(process.env.REDIS_PORT),
  },
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect().catch(console.error);

export default redisClient;
