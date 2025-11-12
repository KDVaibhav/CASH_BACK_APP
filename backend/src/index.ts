import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes";
import mongoose from "mongoose";
import { currencyConverter } from "./utils";
dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI!;

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Server connected to DB");
  } catch (err) {
    console.error("Error connecting to MongoDb", err);
  }
};

app.use(cors());
app.use(express.json());
currencyConverter(100, "USD", "GBP");
app.use("/api", apiRouter);

connectDb().then(() => {
  app.listen(4000, () => console.log("Server Running on port 4000"));
});
