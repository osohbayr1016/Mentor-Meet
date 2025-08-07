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

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8000",
    ],
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["*"],
  })
);

// Logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());
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

    // Test endpoint to verify CORS
    app.get("/test-cors", (req, res) => {
      console.log("🧪 Test CORS endpoint hit");
      res.json({
        message: "CORS is working!",
        timestamp: new Date().toISOString(),
      });
    });

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
