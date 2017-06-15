
import kue from 'kue';
import { redis } from './globals';

const jobQueue = kue.createQueue({ redis: redis.uri });

export default jobQueue;

export function createJob(name, data = {}) {
  data.date = data.date || (new Date()).toISOString();
  const job = jobQueue.create(name, data).save((err) => {
    if (err) {
      console.error(`Creating ${name} job failed`);
      console.error(err);
    } else {
      console.log(`${name} job started at ${data.date}`);
      console.log(`job ID = ${job.id}`);
    }
  });

  job.on('complete', () => {
    console.log(`${name} job completed`);
  }).on('failed attempt', (err, doneAttempts) => {
    console.error(`${name} job attempt failed, done attempts = ${doneAttempts}`);
    console.error(err);
  }).on('failed', (err) => {
    console.error(`${name} job failed`);
    console.error(err);
  });
}
