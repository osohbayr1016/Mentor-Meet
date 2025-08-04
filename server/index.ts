// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import { MentorRouter } from "./router/mentor-router";
// import { StudentRouter } from "./router/student-router";
// import { CategoryRouter } from "./router/category-router";
// import { chatRouter } from "./router/chat-router";
// import { CalendarRouter } from "./router/calendar-router";

// // dotenv.config() хамгийн эхэнд байх ёстой
// dotenv.config();

// const dataBaseConnection = async () => {
//   await mongoose.connect(
//     "mongodb+srv://anandoctane4:uVPeDYELoaGaO46X@food-delivery.wdjmkc7.mongodb.net/mentor-meet"
//   );
// };

// dataBaseConnection();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 8000;
// const uri = process.env.MONGODB_URI;

// if (!uri) {
//   console.error("MONGO_URI is not defined");
//   process.exit(1);
// }

// app.use(MentorRouter);
// app.use(StudentRouter);
// app.use(CategoryRouter);
// app.use(chatRouter);
// app.use(CalendarRouter);

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// ✅ 1. ENV-ийг хамгийн эхэнд ачааллана
import dotenv from "dotenv";
dotenv.config();

// 2. Бусад импорт
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MentorRouter } from "./router/mentor-router";
import { StudentRouter } from "./router/student-router";
import { CategoryRouter } from "./router/category-router";
import { chatRouter } from "./router/chat-router";
import { CalendarRouter } from "./router/calendar-router";

// 3. Express app
const app = express();
app.use(cors());
app.use(express.json());

// 4. DB холболт
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI not defined in .env");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// 5. Router-ууд
app.use(MentorRouter);
app.use(StudentRouter);
app.use(CategoryRouter);
app.use(chatRouter);
app.use(CalendarRouter);

// 6. Server эхлүүлэх
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
