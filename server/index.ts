import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { StudentRouter } from "./router/student-router";

const dataBaseConnection = async () => {
  await mongoose.connect(
    "mongodb+srv://anandoctane4:uVPeDYELoaGaO46X@food-delivery.wdjmkc7.mongodb.net/mentor-meet"
  );
};

dataBaseConnection();

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGO_URI is not defined");
  process.exit(1);
}

app.use(StudentRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
