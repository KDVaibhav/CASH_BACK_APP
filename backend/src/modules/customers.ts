import { Router } from "express";
import { Customer, Store, TransactionLog, TransactionStatus } from "../schema";
import { CustomerZ } from "../zod-schema";
const r: Router = Router();

r.get("/:storeId/store", async (req, res) => {
  try {
    // Parse query parameters and ensure correct types
    let { search, page = 1, limit = 25 } = req.query;
    const storeId = req.params.storeId;
    page = typeof page === "string" ? parseInt(page) : 1;
    limit = typeof limit === "string" ? parseInt(limit) : 25;

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
      query.storeId = storeId;
    }

    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalCount = await Customer.countDocuments(query);
    const hasMore = page * limit < totalCount;
    res.status(200).json({ customers, hasMore });
  } catch (err) {
    console.error("Error Fetching Customer", err);
    res.status(500).json({ error: "Error Fetching Customer" });
  }
});

//get transaction logs
r.get("/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    let { page = 1, limit = 25 } = req.query;
    page = typeof page === "string" ? parseInt(page) : 1;
    limit = typeof limit === "string" ? parseInt(limit) : 25;

    const transactions = await TransactionLog.find({ customerId })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalCount = await TransactionLog.countDocuments();
    const hasMore = page * limit < totalCount;
    res.status(200).json({ transactions, hasMore });
  } catch (err) {
    console.error("Error Fetching Customer Transaction Logs", err);
    res.status(500).json({ error: "Error Fetching Customer Transaction Logs" });
  }
});

r.get("/:customerId/failed", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    let { page = 1, limit = 25 } = req.query;
    page = typeof page === "string" ? parseInt(page) : 1;
    limit = typeof limit === "string" ? parseInt(limit) : 25;

    const transactions = await TransactionLog.find({
      customerId,
      status: TransactionStatus.FAILED,
    })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalCount = await TransactionLog.countDocuments({
      customerId,
      status: TransactionStatus.FAILED,
    });
    const hasMore = page * limit < totalCount;
    res.status(200).json({ transactions, hasMore });
  } catch (err) {
    console.error("Error Fetching Customer Transaction Logs", err);
    res.status(500).json({ error: "Error Fetching Customer Transaction Logs" });
  }
});

r.get("/:customerId/expired", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    let { page = 1, limit = 25 } = req.query;
    page = typeof page === "string" ? parseInt(page) : 1;
    limit = typeof limit === "string" ? parseInt(limit) : 25;

    const transactions = await TransactionLog.find({
      customerId,
      status: TransactionStatus.EXPIRED,
    })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalCount = await TransactionLog.countDocuments({
      customerId,
      status: TransactionStatus.EXPIRED,
    });
    const hasMore = page * limit < totalCount;
    res.status(200).json({ transactions, hasMore });
  } catch (err) {
    console.error("Error Fetching Customer Transaction Logs", err);
    res.status(500).json({ error: "Error Fetching Customer Transaction Logs" });
  }
});

r.post("/", async (req, res) => {
  const parsedCustomer = CustomerZ.safeParse(req.body);
  if (!parsedCustomer.success) {
    return res.status(400).json({ error: parsedCustomer.error });
  }
  try {
    const existingCustomer = await Customer.find({
      email: parsedCustomer.data.email,
    });
    if (existingCustomer)
      return res.status(409).json({
        message: `Customer with ${parsedCustomer.data.email} already exists`,
      });
    const store = await Store.findById(parsedCustomer.data.storeId);
    if (!store) {
      return res.status(404).json({
        error: `Store with id:${parsedCustomer.data.storeId} not exists`,
      });
    }
    await Customer.create(parsedCustomer.data);
    const customers = await Customer.find().sort({ name: 1 }).limit(25);
    const totalCount = await Customer.countDocuments();
    const hasMore = 25 < totalCount;
    return res.status(200).json({ customers, hasMore });
  } catch (err) {
    console.error("Error Creating Customer", err);
    res.status(500).json({ error: "Error Creating Customer" });
  }
});

r.put("/:customerId", async (req, res) => {
  const customerId = req.params.customerId;
  const parsedCustomer = CustomerZ.safeParse(req.body);
  if (!parsedCustomer.success) {
    return res.status(400).json({ error: parsedCustomer.error });
  }
  try {
    const store = await Store.findById(parsedCustomer.data.storeId);
    if (!store) {
      return res.status(404).json({
        error: `Store with id:${parsedCustomer.data.storeId} not exists`,
      });
    }
    await Customer.findByIdAndUpdate({ customerId }, parsedCustomer.data);
    const customers = await Customer.find().sort({ name: 1 }).limit(25);
    const totalCount = await Customer.countDocuments();
    const hasMore = 25 < totalCount;
    return res.status(200).json({ customers, hasMore });
  } catch (err) {
    console.error("Error Updating Customer", err);
    res.status(500).json({ error: "Error Updating Customer" });
  }
});

r.delete("/:customerId", async (req, res) => {
  const customerId = req.params.customerId;
  try {
    await Customer.deleteOne({ customerId });
    const customers = await Customer.find().sort({ name: 1 }).limit(25);
    const totalCount = await Customer.countDocuments();
    const hasMore = 25 < totalCount;
    return res.status(200).json({ customers, hasMore });
  } catch (err) {
    console.error("Error Deleting Customer", err);
    res.status(500).json({ error: "Error Deleting Customer" });
  }
});

export default r;
