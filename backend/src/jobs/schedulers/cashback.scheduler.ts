// src/jobs/schedulers/cashback.scheduler.ts
import { cashbackQueue } from "../queues/cashback.queue";

// Schedule cashback activation after `m` days and expiration after `n` days
export const scheduleCashbackJobs = async (
  transactionId: string,
  mDays: number,
  nDays: number
) => {
  const now = new Date();

  const activateTime = new Date(now.getTime() + mDays * 24 * 60 * 60 * 1000);
  const expireTime = new Date(now.getTime() + nDays * 24 * 60 * 60 * 1000);

  await cashbackQueue.add(
    "activateCashback",
    { type: "ACTIVATE", transactionId },
    { delay: activateTime.getTime() - now.getTime() }
  );

  await cashbackQueue.add(
    "expireCashback",
    { type: "EXPIRE", transactionId },
    { delay: expireTime.getTime() - now.getTime() }
  );

  console.log(
    `🕒 Cashback scheduled: activate in ${mDays} days, expire in ${nDays} days`
  );
};
