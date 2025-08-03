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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.getMessages = void 0;
const chat_model_1 = require("../model/chat-model");
const student_model_1 = require("../model/student-model");
const mentor_model_1 = require("../model/mentor-model");
const utils_1 = require("../utils");
const getMessages = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield chat_model_1.MessageModel.find().sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ error: "Мессежүүд авах үед алдаа гарлаа." });
    }
});
exports.getMessages = getMessages;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, message, studentProfile, requestType = "chat" } = req.body;
        if (!email || !message) {
            return res
                .status(400)
                .json({ error: "Email болон message шаардлагатай!" });
        }
        // Intent detection
        const intent = yield (0, utils_1.detectIntent)(message);
        // Student profile-г олж авна эсвэл үүсгэнэ
        let finalStudentProfile = studentProfile;
        if (!studentProfile) {
            // MongoDB-оос student profile-г хайж олно
            const existingStudent = yield student_model_1.StudentModel.findOne({ email });
            if (existingStudent) {
                finalStudentProfile = {
                    name: existingStudent.firstName +
                        " " +
                        existingStudent.lastName,
                    email: existingStudent.email,
                    phoneNumber: existingStudent.phoneNumber || "",
                };
            }
            else {
                // Хэрэв student profile байхгүй бол null болгоно
                finalStudentProfile = null;
            }
        }
        const mentor = yield mentor_model_1.MentorModel.findOne({ email });
        let senderType = "";
        if (finalStudentProfile)
            senderType = "student";
        else if (mentor)
            senderType = "mentor";
        else
            senderType = "unknown";
        const userMsg = yield chat_model_1.MessageModel.create({
            email,
            message,
            senderType,
            intent,
        });
        let aiReply = "";
        let mentors = [];
        // Request type-аас хамааран өөр өөр хариу өгнө
        if (requestType === "mentor-suggestion" ||
            intent === "хүсэлт" ||
            intent === "тусламж") {
            // Mentor санал болгох
            try {
                // MongoDB-оос mentor-уудыг авах
                mentors = yield mentor_model_1.MentorModel.find({});
                console.log(`Found ${mentors.length} mentors from database`);
                // Use the new getAiReply utility function
                aiReply = yield (0, utils_1.getAiReply)(message, intent, finalStudentProfile, mentors);
            }
            catch (err) {
                console.error("Mentor suggestion error:", err);
                aiReply = "Ментор санал болгоход алдаа гарлаа.";
            }
        }
        else {
            // Ердийн чат хариу - энгийн fallback хариу
            // Mentor-уудыг эхлээд авах
            if (mentors.length === 0) {
                mentors = yield mentor_model_1.MentorModel.find({}).limit(5);
                console.log(`Found ${mentors.length} mentors for general chat`);
            }
            aiReply = yield (0, utils_1.getAiReply)(message, intent, finalStudentProfile, mentors);
        }
        if (req.query.save !== "true") {
            return res.status(201).json(Object.assign({ messages: [
                    userMsg,
                    {
                        email: "bot@mentormeet.mn",
                        message: aiReply,
                        senderType: "bot",
                        intent: "бусад",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ] }, (mentors.length > 0 && { mentors: mentors.slice(0, 5) })));
        }
        const botMsg = yield chat_model_1.MessageModel.create({
            email: "bot@mentormeet.mn",
            message: aiReply,
            senderType: "bot",
            intent: "other",
        });
        res.status(201).json(Object.assign({ messages: [userMsg, botMsg] }, (mentors.length > 0 && { mentors: mentors.slice(0, 5) })));
    }
    catch (err) {
        console.error("createMessage error:", err);
        res.status(500).json({ error: "Мессеж хадгалах үед алдаа гарлаа" });
    }
});
exports.createMessage = createMessage;
