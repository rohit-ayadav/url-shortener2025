import { Ratelimit } from '@upstash/ratelimit';
import redis from './redisDB';

const rateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(20, "1m"), // 5 requests per minute
});

export default rateLimit;