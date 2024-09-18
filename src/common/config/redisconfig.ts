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

// Test Redis connection
// redisClient.set('test_key', 'test_value').then(() => {
//   redisClient.get('test_key').then((value) => {
//     console.log('Redis test value:', value);
//   });
//});
export default redisClient;
