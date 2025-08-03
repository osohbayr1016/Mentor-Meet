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
exports.creatMessage = exports.getMessages = void 0;
const chat_model_1 = require("../model/chat-model");
const openai_1 = require("openai");
// OpenAI client үүсгэх
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Intent detection функц
const detectIntent = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageLower = message.toLowerCase();
        // Хүсэлт (request) - ментор хүссэн, тусламж хүссэн
        if (messageLower.includes("хэрэгтэй") ||
            messageLower.includes("хүсэж") ||
            messageLower.includes("санал") ||
            messageLower.includes("ментор") ||
            messageLower.includes("туслах") ||
            messageLower.includes("заах") ||
            messageLower.includes("сургах") ||
            messageLower.includes("зөвлөх") ||
            messageLower.includes("хүсэлт") ||
            messageLower.includes("хүссэн") ||
            messageLower.includes("хэрэг") ||
            messageLower.includes("байна") ||
            messageLower.includes("please") ||
            messageLower.includes("help") ||
            messageLower.includes("need") ||
            messageLower.includes("want") ||
            messageLower.includes("looking for")) {
            return "request";
        }
        // Тусламж (help) - асуулт, зөвлөгөө
        if (messageLower.includes("асуулт") ||
            messageLower.includes("асуу") ||
            messageLower.includes("яаж") ||
            messageLower.includes("хэрхэн") ||
            messageLower.includes("юу") ||
            messageLower.includes("аль") ||
            messageLower.includes("хэзээ") ||
            messageLower.includes("хаана") ||
            messageLower.includes("яагаад") ||
            messageLower.includes("зөвлөгөө") ||
            messageLower.includes("заавар") ||
            messageLower.includes("тусламж") ||
            messageLower.includes("?") ||
            messageLower.includes("how") ||
            messageLower.includes("what") ||
            messageLower.includes("when") ||
            messageLower.includes("where") ||
            messageLower.includes("why") ||
            messageLower.includes("which")) {
            return "help";
        }
        // Асуудал (issue) - алдаа, гомдол, санаа зовниж байгаа
        if (messageLower.includes("алдаа") ||
            messageLower.includes("асуудал") ||
            messageLower.includes("болохгүй") ||
            messageLower.includes("ажиллахгүй") ||
            messageLower.includes("гарлаа") ||
            messageLower.includes("гомдол") ||
            messageLower.includes("санаа") ||
            messageLower.includes("зовниж") ||
            messageLower.includes("буруу") ||
            messageLower.includes("алдаатай") ||
            messageLower.includes("error") ||
            messageLower.includes("problem") ||
            messageLower.includes("issue") ||
            messageLower.includes("bug") ||
            messageLower.includes("broken") ||
            messageLower.includes("not working") ||
            messageLower.includes("wrong") ||
            messageLower.includes("complaint")) {
            return "issue";
        }
        // Бусад (other) - мэндчилгээ, ердийн яриа
        return "other";
    }
    catch (error) {
        console.error("Error in detectIntent:", error);
        return "other";
    }
});
// AI хариу үүсгэх функц (OpenAI API ашиглаж)
const generateAIResponse = (userMessage, intent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let systemPrompt = "";
        // Intent-ээс хамааран system prompt тохируулах
        switch (intent) {
            case "request":
                systemPrompt = `Чи Mentor Meet платформын AI туслах. Хэрэглэгч ментор эсвэл тусламж хүсэж байна. 
        Таны хариулт нь:
        - Хүндэтгэлтэй, тусламж үзүүлэх хүсэлтэй байх
        - Mentor Meet платформын үйлчилгээг танилцуулах
        - Менторуудтай холбогдох арга замыг зааж өгөх
        - Зөвхөн монголоор хариулах`;
                break;
            case "help":
                systemPrompt = `Чи Mentor Meet платформын AI туслах. Хэрэглэгч асуулт эсвэл зөвлөгөө хүсэж байна.
        Таны хариулт нь:
        - Асуултыг ойлгомжтой тайлбарлах
        - Хэрэв боломжтой бол шууд хариулах
        - Хэрэв нарийн мэдлэг шаардлагатай бол менторуудтай холбогдохыг зөвлөх
        - Зөвхөн монголоор хариулах`;
                break;
            case "issue":
                systemPrompt = `Чи Mentor Meet платформын AI туслах. Хэрэглэгч асуудал эсвэл гомдол илэрхийлж байна.
        Таны хариулт нь:
        - Асуудлыг ойлгож, уучлал хүсэх
        - Асуудлыг шийдвэрлэх арга замыг санал болгох
        - Хэрэв шаардлагатай бол дэмжлэгийн хэсэгт холбогдохыг зөвлөх
        - Зөвхөн монголоор хариулах`;
                break;
            default:
                systemPrompt = `Чи Mentor Meet платформын AI туслах. Хэрэглэгчтэй найрсаг, тусламж үзүүлэх хүсэлтэй байж ярилцах.
        Таны хариулт нь:
        - Хүндэтгэлтэй, найрсаг байх
        - Mentor Meet платформын үйлчилгээг танилцуулах
        - Зөвхөн монголоор хариулах`;
        }
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            temperature: 0.7,
            max_tokens: 300,
        });
        return (response.choices[0].message.content ||
            "Уучлаарай, хариу бэлдэхэд алдаа гарлаа.");
    }
    catch (error) {
        console.error("OpenAI API error:", error);
        // API алдаа гарвал энгийн хариу өгөх
        return generateSimpleResponse(userMessage);
    }
});
// Энгийн хариу үүсгэх функц (fallback)
const generateSimpleResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();
    // Мэндчилгээ
    if (messageLower.includes("сайн") ||
        messageLower.includes("hello") ||
        messageLower.includes("hi") ||
        messageLower.includes("мэнд")) {
        return "Сайн байна уу! Mentor Meet платформд тавтай морил! Би танд тусламж үзүүлэхэд бэлэн байна.";
    }
    // Програмчлалын талаар
    if (messageLower.includes("программ") ||
        messageLower.includes("код") ||
        messageLower.includes("технологи") ||
        messageLower.includes("python") ||
        messageLower.includes("javascript") ||
        messageLower.includes("java") ||
        messageLower.includes("react") ||
        messageLower.includes("node")) {
        return "Программчлалын талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд JavaScript, Python, React, Node.js зэрэг технологиудыг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Хууль, эрх зүй
    if (messageLower.includes("хууль") ||
        messageLower.includes("эрх") ||
        messageLower.includes("law") ||
        messageLower.includes("legal")) {
        return "Хууль, эрх зүйн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд хууль, эрх зүйн асуудлуудыг тайлбарлахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Эрүүл мэнд
    if (messageLower.includes("эрүүл") ||
        messageLower.includes("анагаах") ||
        messageLower.includes("health") ||
        messageLower.includes("medical")) {
        return "Эрүүл мэндийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд эрүүл мэндийн зөвлөгөө өгөхөд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Дизайн
    if (messageLower.includes("дизайн") ||
        messageLower.includes("график") ||
        messageLower.includes("design") ||
        messageLower.includes("art")) {
        return "Дизайн, графикийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд UI/UX дизайн, график дизайн зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Бизнес
    if (messageLower.includes("бизнес") ||
        messageLower.includes("менеджмент") ||
        messageLower.includes("business") ||
        messageLower.includes("management")) {
        return "Бизнес, менежментийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд бизнес стратеги, менежмент зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Ментор хүсэлт
    if (messageLower.includes("ментор") ||
        messageLower.includes("хэрэгтэй") ||
        messageLower.includes("туслах") ||
        messageLower.includes("заах")) {
        return "Ментор хүсэж байна! Манай платформ дээр олон төрлийн чиглэлээр мэргэшсэн менторууд байна. Тэд танд тусламж үзүүлэхэд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Асуулт
    if (messageLower.includes("яаж") ||
        messageLower.includes("хэрхэн") ||
        messageLower.includes("юу") ||
        messageLower.includes("?") ||
        messageLower.includes("how") ||
        messageLower.includes("what")) {
        return "Сайн асуулт байна! Манай платформ дээр олон төрлийн мэдээлэл, зөвлөгөө байна. Тодорхой асуултаа тавьж, би танд тусламж үзүүлэх боломжтой.";
    }
    // Ерөнхий хариу
    return "Сайн байна уу! Таны асуултад хариулахад баяртай байна. Манай платформ дээр ширээтэн менторууд байна. Тэд танд тусламж үзүүлэхэд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
};
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
const creatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, message } = req.body;
        const intent = yield detectIntent(message);
        const aiReply = yield generateAIResponse(message, intent);
        res.status(200).json({ aiReply });
    }
    catch (err) {
        console.error("createMessage error:", err);
        res.status(500).json({ error: "Мессеж хадгалах үед алдаа гарлаа" });
    }
});
exports.creatMessage = creatMessage;
