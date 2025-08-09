import { Queue, Worker, QueueScheduler, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

export const connection = new IORedis(process.env.REDIS_URL!);
export const mailQueue = new Queue('mail', { connection });
export const smsQueue = new Queue('sms', { connection });
new QueueScheduler('mail', { connection });
new QueueScheduler('sms', { connection });

export const defaultJobOpts: JobsOptions = {
  attempts: 4,
  backoff: { type: 'exponential', delay: 60_000 },
  removeOnComplete: 1000,
  removeOnFail: 1000
};
