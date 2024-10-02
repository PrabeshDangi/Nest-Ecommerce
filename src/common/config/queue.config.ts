import { BullModule } from '@nestjs/bullmq';

//Configuration can be different, but testing ko lagi same conf we are using here!!
export const emailQueueConfig = BullModule.forRoot('emailQueue', {
  connection: {
    host: '172.19.0.2',
    port: 6739,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      age: 5 * 60,
    },
    removeOnFail: {
      age: 5 * 60,
    },
  },
});

export const paymentQueueConfig = BullModule.forRoot('paymentQueue', {
  connection: {
    host: '172.19.0.2',
    port: 6739,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
    removeOnComplete: {
      age: 5 * 60,
    },
    removeOnFail: {
      age: 5 * 60,
    },
  },
});

export const imageUploadQueue = BullModule.forRoot('imageUploadQueue', {
  connection: {
    host: '172.19.0.2',
    port: 6739,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
    removeOnComplete: {
      age: 5 * 60,
    },
    removeOnFail: {
      age: 5 * 60,
    },
  },
});
