import { Router } from "express";
import { Store } from "../schema";
const r: Router = Router();

r.get("/", async (req, res) => {
  try {
    // Parse query parameters and ensure correct types
    let { search, page = 1, limit = 25 } = req.query;
    page = typeof page === "string" ? parseInt(page) : 1;
    limit = typeof limit === "string" ? parseInt(limit) : 25;

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const stores = await Store.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalCount = await Store.countDocuments(query);
    const hasMore = page * limit < totalCount;
    res.status(200).json({ stores, hasMore });
  } catch (err) {
    console.error("Error Fetching Store", err);
    res.status(500).json({ error: "Error Fetching Store" });
  }
});

r.post("/", async (req, res) => {
  const { name } = req.body;
  if (typeof name !== "string")
    return res.status(400).json({ error: "Store Name should be string" });
  try {
    const existingStore = await Store.find({ name: name });
    if (existingStore)
      return res
        .status(409)
        .json({ message: `Store with ${name} already exists` });
    await Store.create({ name: name });
    const stores = await Store.find().sort({ name: 1 }).limit(10);
    const totalCount = await Store.countDocuments();
    const hasMore = 10 < totalCount;
    return res.status(200).json({ stores, hasMore });
  } catch (err) {
    console.error("Error Creating Store", err);
    res.status(500).json({ error: "Error Creating Store" });
  }
});

r.put("/:storeId", async (req, res) => {
  const storeId = req.params.storeId;
  const { newName } = req.body;
  if (typeof newName !== "string")
    return res.status(400).json({ error: "Store Name should be string" });
  try {
    const existingStore = await Store.find({ name: newName });
    if (existingStore)
      return res
        .status(409)
        .json({ message: `Store with ${newName} already exists` });
    await Store.findByIdAndUpdate({ storeId }, { name: newName });
    const stores = await Store.find().sort({ name: 1 }).limit(10);
    const totalCount = await Store.countDocuments();
    const hasMore = 10 < totalCount;
    return res.status(200).json({ stores, hasMore });
  } catch (err) {
    console.error("Error Updating Store", err);
    res.status(500).json({ error: "Error Updating Store" });
  }
});

r.delete("/:storeId", async (req, res) => {
  const storeId = req.params.storeId;
  try {
    await Store.deleteOne({ storeId });
    const stores = await Store.find().sort({ name: 1 }).limit(10);
    const totalCount = await Store.countDocuments();
    const hasMore = 10 < totalCount;
    return res.status(200).json({ stores, hasMore });
  } catch (err) {
    console.error("Error Deleting Store", err);
    res.status(500).json({ error: "Error Deleting Store" });
  }
});

export default r;
