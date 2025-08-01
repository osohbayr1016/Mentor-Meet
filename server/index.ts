import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { MentorRouter } from "./router/mentor-router";
import { StudentRouter } from "./router/student-router";
import { CategoryRouter } from "./router/category-router";
import { chatRouter } from "./router/chat-router";
import { CalendarRouter } from "./router/calendar-router";

dotenv.config();

const dataBaseConnection = async () => {
  const uri =
    process.env.MONGODB_URI ||
    "mongodb+srv://anandoctane4:uVPeDYELoaGaO46X@food-delivery.wdjmkc7.mongodb.net/mentor-meet";
  await mongoose.connect(uri);
};

dataBaseConnection();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use(MentorRouter);
app.use(StudentRouter);
app.use(CategoryRouter);
app.use(chatRouter);
app.use(CalendarRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
