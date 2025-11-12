import { Router } from "express";
import campaignsRouter from "./modules/campaigns";
import storesRouter from "./modules/stores";
import customersRouter from "./modules/stores";
import adminRouter from "./modules/admin";
import ordersRouter from "./modules/orders";
const r: Router = Router();

r.use("/campaigns", campaignsRouter);
r.use("/stores", storesRouter);
r.use("/customers", customersRouter);
r.use("/orders", ordersRouter);
r.use("/admin", adminRouter);

export default r;
