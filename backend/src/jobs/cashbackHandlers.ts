// src/jobs/cashbackHandlers.ts
import mongoose from "mongoose";
import { TransactionLog, Customer } from "../schema";
import { currencyConverter } from "../utils";

export async function deliverCashback(transactionId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = await TransactionLog.findByIdAndUpdate(
      transactionId,
      { status: "ALLOTED" },
      { new: true, session }
    );

    if (!transaction) throw new Error("Transaction not found");

    const customer = await Customer.findById(transaction.customerId).session(session);
    if (!customer) throw new Error("Customer not found");

    const amount = currencyConverter(
      transaction.value.amount,
      transaction.value.currency,
      customer.currency
    );

    await Customer.findByIdAndUpdate(
      transaction.customerId,
      { $inc: { customerLifeTimeCashback: +amount } },
      { session }
    );

    await session.commitTransaction();
    return { ok: true };
  } catch (err: any) {
    await session.abortTransaction();
    return { ok: false, error: err.message };
  } finally {
    session.endSession();
  }
}

export async function expireCashback(transactionId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = await TransactionLog.findById(transactionId).session(session);
    if (!transaction) throw new Error("Transaction not found");

    if (transaction.status !== "ALLOTED") {
      await session.commitTransaction();
      return { ok: true, skipped: true };
    }

    await TransactionLog.findByIdAndUpdate(
      transactionId,
      { status: "EXPIRED" },
      { session }
    );
    const customer = await Customer.findById(transaction.customerId).session(session);
    if (!customer) throw new Error("Customer not found");

    const deductedAmount = currencyConverter(
      transaction.value.amount,
      transaction.value.currency,
      customer.currency
    );

    await Customer.findByIdAndUpdate(
      transaction.customerId,
      { $inc: { customerLifeTimeCashback: -deductedAmount } },
      { session }
    );

    await session.commitTransaction();
    return { ok: true };
  } catch (err: any) {
    await session.abortTransaction();
    return { ok: false, error: err.message };
  } finally {
    session.endSession();
  }
}
