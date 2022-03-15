const { Worker } = require("bullmq");
const { cryptoJob } = require("./tasks");

const worker = new Worker(
  "foo",
  async (job) => {
    console.log(`Job ${job.name} starting`);
    cryptoJob(job.name);
  },
  {
    connection: {
      host: "ukraine-crypto-donation-tracker_redis_1",
      port: 6379,
    },
  }
);
