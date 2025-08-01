"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mentor_router_1 = require("./router/mentor-router");
const student_router_1 = require("./router/student-router");
const category_router_1 = require("./router/category-router");
const chat_router_1 = require("./router/chat-router");
const calendar_router_1 = require("./router/calendar-router");
dotenv_1.default.config();
const dataBaseConnection = async () => {
    const uri = process.env.MONGODB_URI ||
        "mongodb+srv://anandoctane4:uVPeDYELoaGaO46X@food-delivery.wdjmkc7.mongodb.net/mentor-meet";
    await mongoose_1.default.connect(uri);
};
dataBaseConnection();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 8000;
app.use(mentor_router_1.MentorRouter);
app.use(student_router_1.StudentRouter);
app.use(category_router_1.CategoryRouter);
app.use(chat_router_1.chatRouter);
app.use(calendar_router_1.CalendarRouter);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
