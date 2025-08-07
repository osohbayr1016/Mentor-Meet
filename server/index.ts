import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Model-уудыг populate зөв ажиллуулахын тулд бүртгэх
import "./model/student-model";
import "./model/mentor-model";
import "./model/booking-model";

// ✅ Routes import
import { MentorRouter } from "./router/mentor-router";
import { StudentRouter } from "./router/student-router";
import { CategoryRouter } from "./router/category-router";
import { chatRouter } from "./router/chat-router";
import { CalendarRouter } from "./router/calendar-router";
import { PaymentRouter } from "./router/payment-router";
import { BookingRouter } from "./router/booking-router";
import { NotificationRouter } from "./router/notification-router";

const app = express();

// ✅ CORS тохиргоо
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ✅ JSON body parsing (10mb хүртэл)
app.use(express.json({ limit: "10mb" }));

// ✅ MongoDB холболт
const uri = process.env.MONGODB_URI;
const dataBaseConnection = async () => {
  try {
    await mongoose.connect(uri || "", {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log("✅ DB connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// ✅ Server start
const startServer = async () => {
  try {
    await dataBaseConnection();

    // 📦 Бүх router-ууд
    app.use(MentorRouter);
    app.use(StudentRouter);
    app.use(CategoryRouter);
    app.use(chatRouter);
    app.use(CalendarRouter);
    app.use(PaymentRouter);
    app.use(BookingRouter);
    app.use(NotificationRouter);

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
