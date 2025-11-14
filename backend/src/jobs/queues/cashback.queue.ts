// src/jobs/queues/cashback.queue.ts
import { Queue } from "bullmq";
import { connection } from "../../redis";

export const cashbackQueue = new Queue("cashbackQueue", {
  connection,
});
