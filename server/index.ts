import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MentorRouter } from "./router/mentor-router";
import { StudentRouter } from "./router/student-router";
import { CategoryRouter } from "./router/category-router";
import { chatRouter } from "./router/chat-router";
import { CalendarRouter } from "./router/calendar-router";
import { PaymentRouter } from "./router/payment-router";
import MeetingRouter from "./router/meeting.router";
import { BookingRouter } from "./router/booking-router";
import { NotificationRouter } from "./router/notification-router";

const app = express();

// Memory optimization
process.setMaxListeners(0);
if (process.env.NODE_ENV === "production") {
  // Set memory limit for production
  process.env.NODE_OPTIONS = "--max-old-space-size=512";
}

app.use(
  cors({
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json({ limit: "5mb" })); // Reduced from 10mb to 5mb to save memory

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 second timeout
  next();
});

const uri = process.env.MONGODB_URI;
const dataBaseConnection = async () => {
  try {
    await mongoose.connect(uri || "", {
      maxPoolSize: 10, // Limit connection pool size
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferCommands: false, // Disable mongoose buffering
    });
    // DB connected
  } catch (error) {
    console.error("Database connection failed:", error);
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
    app.use(MeetingRouter);
    app.use(BookingRouter);
    app.use(NotificationRouter);

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      // Server running on port ${PORT}
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
