"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatAssistant = exports.createMessage = exports.getMessages = void 0;
const chat_model_1 = require("../model/chat-model");
const student_model_1 = require("../model/student-model");
const mentor_model_1 = require("../model/mentor-model");
const detectIntent_1 = require("../  utils/detectIntent");
const getAiReply_1 = require("../  utils/getAiReply");
const openai_1 = require("openai");
const getMessages = async (_req, res) => {
    try {
        const messages = await chat_model_1.MessageModel.find().sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ error: "Мессежүүд авах үед алдаа гарлаа." });
    }
};
exports.getMessages = getMessages;
const createMessage = async (req, res) => {
    try {
        const { email, message, studentProfile } = req.body;
        if (!email || !message) {
            return res
                .status(400)
                .json({ error: "Email болон message шаардлагатай!" });
        }
        const intent = await (0, detectIntent_1.detectIntent)(message);
        const allowedIntents = ["асуудал", "хүсэлт", "тусламж"];
        if (!allowedIntents.includes(intent)) {
            return res.status(400).json({
                error: `'${intent}' intent дэмжигдэхгүй байна. Зөвшөөрөгдсөн утгууд: асуудал, хүсэлт, тусламж.`,
            });
        }
        const student = await student_model_1.StudentModel.findOne({ email });
        const mentor = await mentor_model_1.MentorModel.findOne({ email });
        let senderType = "";
        if (student)
            senderType = "student";
        else if (mentor)
            senderType = "mentor";
        else
            senderType = "unknown";
        const userMsg = await chat_model_1.MessageModel.create({
            email,
            message,
            senderType,
            intent,
        });
        const aiReply = await (0, getAiReply_1.getAiReply)(message).catch(() => "Уучлаарай, асуултад одоогоор хариулж чадсангүй.");
        if (req.query.save !== "true") {
            return res.status(201).json({
                messages: [
                    userMsg,
                    {
                        email: "bot@mentormeet.mn",
                        message: aiReply,
                        senderType: "bot",
                        intent: "other",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            });
        }
        const botMsg = await chat_model_1.MessageModel.create({
            email: "bot@mentormeet.mn",
            message: aiReply,
            senderType: "bot",
            intent: "бусад",
        });
        res.status(201).json({
            messages: [userMsg, botMsg],
        });
    }
    catch (err) {
        console.error(" createMessage error:", err);
        res.status(500).json({ error: "Мессеж хадгалах үед алдаа гарлаа" });
    }
};
exports.createMessage = createMessage;
const chatAssistant = async (req, res) => {
    try {
        const { message, studentProfile } = req.body;
        const mentors = await mentor_model_1.MentorModel.find({});
        const prompt = `
Сурагчийн мэдээлэл:
${JSON.stringify(studentProfile, null, 2)}

Боломжит менторууд:
${mentors
            .map((m) => {
            var _a, _b;
            return `- ${m.firstName || ""} ${m.lastName || ""}: ${m.bio} (Мэргэжил: ${m.profession}, Туршлага: ${((_a = m.experience) === null || _a === void 0 ? void 0 : _a.careerDuration) || ""}, Чиглэл: ${((_b = m.category) === null || _b === void 0 ? void 0 : _b.categoryId) || ""})`;
        })
            .join("\n")}

Сурагчийн асуулт:
"${message}"

Чи Mentor Meet платформын AI туслах. Сурагчид хамгийн тохиромжтой ментор(ууд)-ыг сонгож, яагаад тохирохыг товч тайлбарла. Хариултаа зөвхөн монголоор бич.
    `;
        const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const aiRes = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Чи Mentor Meet платформын туслах чатбот." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });
        res.json({ reply: aiRes.choices[0].message.content });
    }
    catch (err) {
        res.status(500).json({ error: "AI-тай холбогдоход алдаа гарлаа." });
    }
};
exports.chatAssistant = chatAssistant;
