// src/jobs/scheduler.ts
import cron from "node-cron";
import { ScheduledJob } from "../schema";
import { deliverCashback, expireCashback } from "./cashbackHandlers";

export function startScheduler() {
  console.log("Cron Scheduler Running");
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    const jobs = await ScheduledJob.find({
      $or: [
        { category: "SCHEDULED" },
        { category: "FAILED", retries: { $lt: 3 } },
      ],
      scheduledFor: { $lte: now },
    });

    for (const job of jobs) {
      try {
        let result: { ok: boolean; error?: any };
        if (job.type === "DELIVER_CASHBACK") {
          result = await deliverCashback(job.transactionLogId.toString());
        } else {
          result = await expireCashback(job.transactionLogId.toString());
        }

        if (result.ok) {
          await ScheduledJob.findByIdAndUpdate(job._id, {
            category: "COMPLETED",
            processedAt: new Date(),
            error: null,
          });
        } else {
          await ScheduledJob.findByIdAndUpdate(job._id, {
            category: "FAILED",
            retries: job.retries + 1,
            error: result.error,
          });
        }
      } catch (err: any) {
        await ScheduledJob.findByIdAndUpdate(job._id, {
          category: "FAILED",
          retries: job.retries + 1,
          error: err.message,
        });
      }
    }
  });
}
