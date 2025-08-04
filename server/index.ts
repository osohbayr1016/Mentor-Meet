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

const app = express();

// Configure CORS for production
const corsOptions = {
  origin: [
    'http://localhost:3001', // Development frontend
    'https://mentor-meet-pybapseng-twissus-projects.vercel.app', // Production frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Mentor Meet API is running!',
    timestamp: new Date().toISOString(),
    cors: 'configured'
  });
});

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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
