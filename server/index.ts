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

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const dataBaseConnection = async () => {
  await mongoose.connect(uri || "");
  console.log("DB connected");
};

dataBaseConnection();
if (!uri) {
  console.error("❌ MONGODB_URI not defined in .env");
  process.exit(1);
}

app.use(MentorRouter);
app.use(StudentRouter);
app.use(CategoryRouter);
app.use(chatRouter);
app.use(CalendarRouter);
app.use(PaymentRouter);
app.use(MeetingRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
