import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import "./model/student-model";
import "./model/mentor-model";
import "./model/booking-model";

import { MentorRouter } from "./router/mentor-router";
import { StudentRouter } from "./router/student-router";
import { CategoryRouter } from "./router/category-router";
import { chatRouter } from "./router/chat-router";
import { CalendarRouter } from "./router/calendar-router";
import { PaymentRouter } from "./router/payment-router";
import { BookingRouter } from "./router/booking-router";
import { NotificationRouter } from "./router/notification-router";

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const dataBaseConnection = async () => {
  try {
    await mongoose.connect(uri || "", {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log(" DB connected");
  } catch (error) {
    console.error(" Database connection failed:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await dataBaseConnection();

    app.use(MentorRouter);
    app.use(StudentRouter);
    app.use(CategoryRouter);
    app.use(chatRouter);
    app.use(CalendarRouter);
    app.use(PaymentRouter);
    app.use(BookingRouter);
    app.use(NotificationRouter);

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {});
  } catch (error) {
    console.error(" Failed to start server:", error);
  }
};

startServer();
