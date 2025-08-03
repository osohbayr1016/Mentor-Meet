"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
// dotenv.config() хамгийн эхэнд байх ёстой
dotenv_1.default.config();
const dataBaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb+srv://anandoctane4:uVPeDYELoaGaO46X@food-delivery.wdjmkc7.mongodb.net/mentor-meet");
});
dataBaseConnection();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
}
app.use("/api", mentor_router_1.MentorRouter);
app.use("/api", student_router_1.StudentRouter);
app.use("/api", category_router_1.CategoryRouter);
app.use("/api", chat_router_1.chatRouter);
app.use("/api", calendar_router_1.CalendarRouter);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
