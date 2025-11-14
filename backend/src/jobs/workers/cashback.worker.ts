// src/jobs/workers/cashback.worker.ts
import { Worker, Job } from "bullmq";
import { connection } from "../../redis";
import { Customer, TransactionLog } from "../../schema";
import { currencyConverter } from "../../utils";
import mongoose from "mongoose";

const cashbackWorker = new Worker(
  "cashbackQueue",
  async (job: Job) => {
    const { transactionId } = job.data;
    if (job.name === "activateCashback") {
      console.log(`Activating cashback for transaction ${transactionId}`);
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const transactionLog = await TransactionLog.findByIdAndUpdate(
          transactionId,
          {
            status: "ALLOTED",
          },
          { new: true, session }
        );
        const customer = await Customer.findById(
          transactionLog!.customerId
        ).session(session);
        if (!customer) {
          return;
        }
        const increaseAmount = currencyConverter(
          transactionLog!.value.amount,
          transactionLog!.value.currency,
          customer.currency
        );
        await Customer.findByIdAndUpdate(
          transactionLog!.customerId,
          {
            $inc: { customerLifeTimeCashback: +increaseAmount },
          },
          { session }
        );
        await session.commitTransaction();
        console.log(` Cashback activated successfully for ${transactionId}`);
      } catch (err: any) {
        await session.abortTransaction();
        console.error(
          `Cashback activation failed for ${transactionId}: ${err.message}`
        );
      } finally {
        session.endSession();
      }
    }
    if (job.name === "expireCashback") {
      console.log(`Expiring cashback for transaction ${transactionId}`);
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const transaction = await TransactionLog.findById(transactionId);
        if (!transaction) {
          return;
        }
        if (transaction.status === "ALLOTED") {
          await TransactionLog.findByIdAndUpdate(
            transactionId,
            {
              status: "EXPIRED",
            },
            { session }
          );
          const customer = await Customer.findById(transaction.customerId);
          if (!customer) {
            return;
          }
          const deductedAmount = currencyConverter(
            transaction.value.amount,
            transaction.value.currency,
            customer.currency
          );
          await Customer.findByIdAndUpdate(
            transaction.customerId,
            {
              $inc: { customerLifeTimeCashback: -deductedAmount },
            },
            { session }
          );
        }
      } catch (err) {
        await session.abortTransaction();
      } finally {
        session.endSession();
      }
    }
  },
  { connection }
);

cashbackWorker.on("completed", (job) => {
  console.log(`Job ${job.id} (${job.data.type}) completed.`);
});

cashbackWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});

export default cashbackWorker;
