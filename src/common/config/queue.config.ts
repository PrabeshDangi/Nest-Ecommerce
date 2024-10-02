// Global connection configuration
export const bullConfig = {
  connection: {
    host: 'localhost',
    port: 6379,
  },
};

// Queue-specific configurations
export const emailQueueConfig = {
  name: 'email-queue',
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
};

export const paymentQueueConfig = {
  name: 'payment-queue',
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
};

export const imageUploadQueueConfig = {
  name: 'image-upload-queue',
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
};
