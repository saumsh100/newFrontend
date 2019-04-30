
import kue from 'kue';
import { redis } from './globals';

// 5 minutes default job expiry, in case worker is off or not responsive, don't stack them!
// TODO: this should match the job frequency GLOBAL
const DEFAULT_JOB_EXPIRY = 1000 * 60 * 5;
const jobQueue = kue.createQueue({ redis: redis.uri });

export default jobQueue;

export function createJob(name, jobData = {}, config = {}) {
  jobData.date = jobData.date || (new Date()).toISOString();
  config.ttl = config.ttl || DEFAULT_JOB_EXPIRY;
  const job = jobQueue.create(name, jobData).ttl(config.ttl).save((err) => {
    if (err) {
      console.error(`Creating ${name} job failed`, err);
    } else {
      console.log(`${name} job started at ${jobData.date}`, `job ID = ${job.id}`);
    }
  });

  job.on('complete', () => {
    console.log(`${name} job completed`);
  }).on('failed attempt', (err, doneAttempts) => {
    console.error(`${name} job attempt failed, done attempts = ${doneAttempts}`, err);
  }).on('failed', (err) => {
    console.error(`ERROR: ${name} job failed`, err);
  });
}
