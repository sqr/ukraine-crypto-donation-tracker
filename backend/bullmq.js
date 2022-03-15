const { Queue, QueueScheduler } = require("bullmq");

const myConnection = {
  connection: {
    host: "ukraine-crypto-donation-tracker_redis_1",
    port: 6389,
  },
};

const myQueueScheduler = new QueueScheduler("foo", myConnection);
const myQueue = new Queue("foo", myConnection);

async function addJobs() {
  await myQueue.add("erc20", { info: "erc20" }, { repeat: { every: 3600000 } });
  await myQueue.add("btc", { info: "btc" }, { repeat: { every: 3600000 } });
  await myQueue.add("eth", { info: "eth" }, { repeat: { every: 3600000 } });
  await myQueue.add(
    "btcexchange",
    { info: "btcexchange" },
    { repeat: { every: 86400000 } }
  );
  await myQueue.add(
    "ethexchange",
    { info: "ethexchange" },
    { repeat: { every: 86400000 } }
  );
}

addJobs().then(() => console.log("Tasks started"));
