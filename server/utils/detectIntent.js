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
exports.detectIntentWithAI = exports.detectIntent = void 0;
const openai_1 = require("openai");
const detectIntent = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageLower = message.toLowerCase();
        // Хүсэлт (request) - ментор хүссэн, тусламж хүссэн
        if (messageLower.includes("хэрэгтэй") ||
            messageLower.includes("хүсэж") ||
            messageLower.includes("санал") ||
            messageLower.includes("болгооч") ||
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
            return "хүсэлт";
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
            return "тусламж";
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
            return "асуудал";
        }
        // Бусад (other) - мэндчилгээ, ердийн яриа
        return "бусад";
    }
    catch (error) {
        console.error("Error in detectIntent:", error);
        return "бусад";
    }
});
exports.detectIntent = detectIntent;
// AI-powered intent detection (alternative method)
const detectIntentWithAI = (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const prompt = `
Чи "Mentor Meet" платформын туслах. Хэрэглэгчийн мессежийг дараах 4 ангиллаар ангил:
- асуудал (хэрвээ хэрэглэгч асуудал, алдаа, гомдол бичсэн бол)
- хүсэлт (ямар нэг зүйл хүссэн, шаардаж байгаа бол)
- тусламж (асуулт, зөвлөгөө, тусламж хүссэн бол)
- бусад (дээрх ангилалд хамаарахгүй бол)

Зөвхөн нэг үгээр хариул: "асуудал", "хүсэлт", "тусламж", эсвэл "бусад".
Жишээ:
- "Сайт ажиллахгүй байна" → "асуудал"
- "Би шинэ нууц үг хүсэж байна" → "хүсэлт"
- "Яаж бүртгүүлэх вэ?" → "тусламж"
- "Сайн байна уу?" → "бусад"
`;
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: prompt.trim(),
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            temperature: 0,
        });
        const intentRaw = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
        if (typeof intentRaw !== "string")
            return "бусад";
        const intent = intentRaw.toLowerCase().trim();
        if (["асуудал", "хүсэлт", "тусламж"].includes(intent)) {
            return intent;
        }
        return "бусад";
    }
    catch (error) {
        console.error("Error in detectIntentWithAI:", error);
        // Fallback to rule-based detection
        return (0, exports.detectIntent)(message);
    }
});
exports.detectIntentWithAI = detectIntentWithAI;
