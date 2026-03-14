import Redis from 'ioredis';

// Use connection string from env, fallback to localhost for development
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);

redis.on('error', (err) => {
  console.error('[Redis Cache] Error:', err);
});

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error('[Cache GET error]', e);
      return null;
    }
  },

  async set(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (e) {
      console.error('[Cache SET error]', e);
    }
  },

  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (e) {
      console.error('[Cache INVALIDATE error]', e);
    }
  }
};
