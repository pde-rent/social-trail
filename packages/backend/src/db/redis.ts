import { createClient } from 'redis';
import config from '../config/env';

const redisClient = createClient({
  url: config.redisUrl
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

export const connectRedis = async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
};

export default redisClient; 