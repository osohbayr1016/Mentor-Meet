import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

console.log(" Моделиудыг ачааллаж байна...");
import "./model/student-model";
import "./model/mentor-model";
import "./model/booking-model";
import "./model/mentor-availability-model";

console.log("🧭 Route-уудыг import хийж байна...");
import { MentorRouter } from "./router/mentor-router";
import { StudentRouter } from "./router/student-router";
import { CategoryRouter } from "./router/category-router";
import { chatRouter } from "./router/chat-router";
import { CalendarRouter } from "./router/calendar-router";
import { PaymentRouter } from "./router/payment-router";
import { BookingRouter } from "./router/booking-router";
import { NotificationRouter } from "./router/notification-router";
import { MentorAvailabilityRouter } from "./router/mentor-availability-router";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "https://mentor-meet.vercel.app",
  "https://mentor-meet-wine.vercel.app",
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : []),
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(" CORS blocked request from:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log(" CORS тохиргоо ачаалагдлаа");

app.use(express.json({ limit: "10mb" }));
console.log("✅ JSON body parser ачаалагдлаа");

const uri = process.env.MONGODB_URI;
const dataBaseConnection = async () => {
  try {
    if (!uri) throw new Error("MONGODB_URI олдсонгүй (.env файлд байна уу?)");

    console.log(" MongoDB-т холбогдож байна...");
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log(" MongoDB холбогдлоо");
  } catch (error) {
    console.error(" MongoDB холболт амжилтгүй:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    console.log(" startServer эхэллээ");

    await dataBaseConnection();

    console.log(" Route бүртгэж байна...");
    app.use(MentorRouter);
    console.log(" MentorRouter бүртгэгдлээ");

    app.use(StudentRouter);
    console.log(" StudentRouter бүртгэгдлээ");

    app.use(CategoryRouter);
    console.log(" CategoryRouter бүртгэгдлээ");

    app.use(chatRouter);
    console.log(" chatRouter бүртгэгдлээ");

    app.use(CalendarRouter);
    console.log(" CalendarRouter бүртгэгдлээ");

    app.use(PaymentRouter);
    console.log(" PaymentRouter бүртгэгдлээ");

    app.use(BookingRouter);
    console.log(" BookingRouter бүртгэгдлээ");

    app.use(NotificationRouter);
    app.use(MentorAvailabilityRouter);

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(
        ` Сервер амжилттай http://localhost:${PORT} дээр ажиллаж байна`
      );
    });
  } catch (error: any) {
    console.error(" Сервер асаахад алдаа:", error.message || error);
    console.trace(" Stack trace:");
  }
};

startServer();
