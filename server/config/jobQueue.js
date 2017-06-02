
import kue from 'kue';
import { redis } from './globals';

export default kue.createQueue({ redis: redis.uri });
