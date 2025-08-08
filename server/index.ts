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
    if (!uri) {
      console.log("⚠️  MONGODB_URI not configured, skipping database connection");
      return false;
    }
    
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.log("⚠️  Server will start without database functionality");
    return false;
  }
};

const startServer = async () => {
  try {
    const dbConnected = await dataBaseConnection();

    // Only add database-dependent routes if database is connected
    if (dbConnected) {
      app.use(MentorRouter);
      app.use(StudentRouter);
      app.use(CategoryRouter);
      app.use(CalendarRouter);
      app.use(PaymentRouter);
      app.use(BookingRouter);
      app.use(NotificationRouter);
    }

    // Chat router can work without database
    app.use(chatRouter);

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      if (!dbConnected) {
        console.log("⚠️  Note: Database features are disabled");
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
