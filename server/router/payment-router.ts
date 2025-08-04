import { Router } from "express";
import { Payment } from "../controller/payment";

export const PaymentRouter = Router();

PaymentRouter.post("/payment/:studentId", Payment);
