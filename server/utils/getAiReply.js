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
exports.getSimpleResponse = exports.getAiReply = void 0;
const openai_1 = require("openai");
const getAiReply = (userMessage, intent, studentProfile, mentors) => __awaiter(void 0, void 0, void 0, function* () {
    const messageLower = userMessage.toLowerCase();
    try {
        // If we have OpenAI API key and mentors data, use AI-powered response
        if (process.env.OPENAI_API_KEY && mentors && mentors.length > 0) {
            return yield getAIResponse(userMessage, intent, studentProfile, mentors);
        }
        // Fallback to rule-based responses with mentor suggestions
        return getRuleBasedResponseWithMentors(messageLower, mentors);
    }
    catch (error) {
        console.error("Error in getAiReply:", error);
        return getRuleBasedResponseWithMentors(messageLower, mentors);
    }
});
exports.getAiReply = getAiReply;
// AI-powered response generation
const getAIResponse = (userMessage, intent, studentProfile, mentors) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const studentInfo = studentProfile
            ? `Сурагчийн мэдээлэл:\n${JSON.stringify(studentProfile, null, 2)}`
            : "Сурагчийн мэдээлэл: Хэрэглэгчийн мэдээл байхгүй байна";
        const mentorsInfo = (mentors === null || mentors === void 0 ? void 0 : mentors.map((m) => {
            var _a, _b;
            return `- ${m.firstName || ""} ${m.lastName || ""}: ${m.bio} (Мэргэжил: ${m.profession}, Туршлага: ${((_a = m.experience) === null || _a === void 0 ? void 0 : _a.careerDuration) || ""}, Чиглэл: ${((_b = m.category) === null || _b === void 0 ? void 0 : _b.categoryId) || ""})`;
        }).join("\n")) || "Менторуудын мэдээл байхгүй байна";
        const prompt = `
${studentInfo}

Боломжит менторууд:
${mentorsInfo}

Сурагчийн асуулт:
"${userMessage}"

Intent: ${intent || "unknown"}

Чи Mentor Meet платформын AI туслах. Сурагчид хамгийн тохиромжтой ментор(ууд)-ыг сонгож, яагаад тохирохыг товч тайлбарла. Хэрэв сурагчийн мэдээл байхгүй бол ерөнхий зөвлөгөө өг. Хариултаа зөвхөн монголоор бич.
    `;
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Чи Mentor Meet платформын туслах чатбот.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });
        return (response.choices[0].message.content || "AI хариу бэлдэхэд алдаа гарлаа.");
    }
    catch (error) {
        console.error("Error in getAIResponse:", error);
        throw error;
    }
});
// Rule-based response generation with mentor suggestions
const getRuleBasedResponseWithMentors = (messageLower, mentors) => {
    // Get relevant mentors based on message content
    const relevantMentors = getRelevantMentors(messageLower, mentors);
    // Python programming related
    if (messageLower.includes("python") || messageLower.includes("программ")) {
        const mentorSuggestions = formatMentorSuggestions(relevantMentors, "Python");
        return `Python сурахад туслах ментор хэрэгтэй байна! Манай платформ дээр Python-д мэргэшсэн ширээтэн менторууд байна. Тэд танд Python програмчлалын үндэс, Django, Flask, data science зэргийг заахад бэлэн байна.${mentorSuggestions}`;
    }
    // General programming
    if (messageLower.includes("код") || messageLower.includes("технологи")) {
        const mentorSuggestions = formatMentorSuggestions(relevantMentors, "програмчлал");
        return `Программчлалын талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд JavaScript, Python, React, Node.js зэрэг технологиудыг заахад бэлэн байна.${mentorSuggestions}`;
    }
    // Business related
    if (messageLower.includes("бизнес") || messageLower.includes("менеджмент")) {
        const mentorSuggestions = formatMentorSuggestions(relevantMentors, "бизнес");
        return `Бизнес, менежментийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд бизнес стратеги, менежмент зэргийг заахад бэлэн байна.${mentorSuggestions}`;
    }
    // Design related
    if (messageLower.includes("дизайн") || messageLower.includes("график")) {
        const mentorSuggestions = formatMentorSuggestions(relevantMentors, "дизайн");
        return `Дизайн, графикийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд UI/UX дизайн, график дизайн зэргийг заахад бэлэн байна.${mentorSuggestions}`;
    }
    // Health related
    if (messageLower.includes("эрүүл") || messageLower.includes("анагаах")) {
        const mentorSuggestions = formatMentorSuggestions(relevantMentors, "эрүүл мэнд");
        return `Эрүүл мэндийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд эрүүл мэндийн зөвлөгөө өгөхөд бэлэн байна.${mentorSuggestions}`;
    }
    // Law related
    if (messageLower.includes("хууль") || messageLower.includes("эрх")) {
        const mentorSuggestions = formatMentorSuggestions(relevantMentors, "хууль");
        return `Хууль, эрх зүйн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд хууль, эрх зүйн асуудлуудыг тайлбарлахад бэлэн байна.${mentorSuggestions}`;
    }
    // Mentor request related
    if (messageLower.includes("санал") || messageLower.includes("болгооч")) {
        const mentorSuggestions = formatMentorSuggestions(relevantMentors, "ментор");
        return `Ментор санал болгох хүсэлт байна! Манай платформ дээр ширээтэн менторууд байна. Та өөрийн сонирхсон чиглэл, мэргэжлийг дэлгэрэнгүй тайлбарлавал би танд тохиромжтой ментор(ууд)-ыг санал болгож болно.${mentorSuggestions}`;
    }
    // Audio/Media related
    if (messageLower.includes("sound") ||
        messageLower.includes("audio") ||
        messageLower.includes("engineer") ||
        messageLower.includes("дуу") ||
        messageLower.includes("хөгжүүлэлт")) {
        const mentorSuggestions = formatMentorSuggestions(relevantMentors, "дуу хөгжүүлэлт");
        return `Sound Engineer сурахад туслах ментор хэрэгтэй байна! Манай платформ дээр дуу хөгжүүлэлт, аудио инженерийн чиглэлээр мэргэшсэн ширээтэн менторууд байна. Тэд танд аудио технологи, дуу бичлэг, хөгжүүлэлт зэргийг заахад бэлэн байна.${mentorSuggestions}`;
    }
    // General response
    const mentorSuggestions = formatMentorSuggestions(relevantMentors, "ерөнхий");
    return `Сайн байна уу! Таны асуултад хариулахад баяртай байна. Манай платформ дээр ширээтэн менторууд байна. Тэд танд тусламж үзүүлэхэд бэлэн байна.${mentorSuggestions}`;
};
// Helper function to get relevant mentors based on message content
const getRelevantMentors = (messageLower, mentors) => {
    if (!mentors || mentors.length === 0)
        return [];
    // Filter mentors based on message content
    const relevantMentors = mentors.filter((mentor) => {
        var _a;
        const mentorInfo = `${mentor.profession || ""} ${mentor.bio || ""} ${((_a = mentor.category) === null || _a === void 0 ? void 0 : _a.categoryId) || ""}`.toLowerCase();
        if (messageLower.includes("python") || messageLower.includes("программ")) {
            return (mentorInfo.includes("python") ||
                mentorInfo.includes("программ") ||
                mentorInfo.includes("developer"));
        }
        if (messageLower.includes("бизнес") ||
            messageLower.includes("менеджмент")) {
            return (mentorInfo.includes("бизнес") ||
                mentorInfo.includes("менеджмент") ||
                mentorInfo.includes("business"));
        }
        if (messageLower.includes("дизайн") || messageLower.includes("график")) {
            return (mentorInfo.includes("дизайн") ||
                mentorInfo.includes("график") ||
                mentorInfo.includes("design"));
        }
        if (messageLower.includes("эрүүл") || messageLower.includes("анагаах")) {
            return (mentorInfo.includes("эрүүл") ||
                mentorInfo.includes("анагаах") ||
                mentorInfo.includes("health"));
        }
        if (messageLower.includes("хууль") || messageLower.includes("эрх")) {
            return (mentorInfo.includes("хууль") ||
                mentorInfo.includes("эрх") ||
                mentorInfo.includes("law"));
        }
        if (messageLower.includes("sound") ||
            messageLower.includes("audio") ||
            messageLower.includes("engineer") ||
            messageLower.includes("дуу")) {
            return (mentorInfo.includes("sound") ||
                mentorInfo.includes("audio") ||
                mentorInfo.includes("engineer") ||
                mentorInfo.includes("дуу") ||
                mentorInfo.includes("хөгжүүлэлт") ||
                mentorInfo.includes("media"));
        }
        return true; // Return all mentors for general requests
    });
    return relevantMentors.slice(0, 3); // Return top 3 relevant mentors
};
// Helper function to format mentor suggestions
const formatMentorSuggestions = (mentors, category) => {
    if (mentors.length === 0) {
        return " Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    const mentorList = mentors
        .map((mentor) => {
        var _a;
        const name = `${mentor.firstName || ""} ${mentor.lastName || ""}`.trim();
        const profession = mentor.profession || "Ментор";
        const experience = ((_a = mentor.experience) === null || _a === void 0 ? void 0 : _a.careerDuration) || "";
        return `• ${name} (${profession}${experience ? `, ${experience} жил туршлагатай` : ""})`;
    })
        .join("\n");
    return `\n\n${category.charAt(0).toUpperCase() + category.slice(1)}-д мэргэшсэн менторууд:\n${mentorList}\n\nЭдгээр менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
};
// Original rule-based response generation (for backward compatibility)
const getRuleBasedResponse = (messageLower) => {
    // Python programming related
    if (messageLower.includes("python") || messageLower.includes("программ")) {
        return "Python сурахад туслах ментор хэрэгтэй байна! Манай платформ дээр Python-д мэргэшсэн ширээтэн менторууд байна. Тэд танд Python програмчлалын үндэс, Django, Flask, data science зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // General programming
    if (messageLower.includes("код") || messageLower.includes("технологи")) {
        return "Программчлалын талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд JavaScript, Python, React, Node.js зэрэг технологиудыг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Business related
    if (messageLower.includes("бизнес") || messageLower.includes("менеджмент")) {
        return "Бизнес, менежментийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд бизнес стратеги, менежмент зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Design related
    if (messageLower.includes("дизайн") || messageLower.includes("график")) {
        return "Дизайн, графикийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд UI/UX дизайн, график дизайн зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Health related
    if (messageLower.includes("эрүүл") || messageLower.includes("анагаах")) {
        return "Эрүүл мэндийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд эрүүл мэндийн зөвлөгөө өгөхөд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Law related
    if (messageLower.includes("хууль") || messageLower.includes("эрх")) {
        return "Хууль, эрх зүйн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд хууль, эрх зүйн асуудлуудыг тайлбарлахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
    }
    // Mentor request related
    if (messageLower.includes("санал") || messageLower.includes("болгооч")) {
        return "Ментор санал болгох хүсэлт байна! Манай платформ дээр ширээтэн менторууд байна. Та өөрийн сонирхсон чиглэл, мэргэжлийг дэлгэрэнгүй тайлбарлавал би танд тохиромжтой ментор(ууд)-ыг санал болгож болно. Жишээ нь: програмчлал, бизнес, дизайн, эрүүл мэнд гэх мэт.";
    }
    // General response
    return "Сайн байна уу! Таны асуултад хариулахад баяртай байна. Манай платформ дээр ширээтэн менторууд байна. Тэд танд тусламж үзүүлэхэд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй. Мөн та өөрийн асуултаа дэлгэрэнгүй тайлбарлавал би танд тохиромжтой ментор(ууд)-ыг санал болгож болно.";
};
// Simple response for testing
const getSimpleResponse = (message) => {
    return getRuleBasedResponse(message.toLowerCase());
};
exports.getSimpleResponse = getSimpleResponse;
