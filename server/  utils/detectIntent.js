"use strict";
// import fetch from "node-fetch"
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectIntent = void 0;
// export const detectIntent = async (
//   message: string
// ): Promise<" issue" | "request" | "help" | "other"> => {
//   const fetch = (await import("node-fetch")).default;
//   const prompt = `
// You are an assistant for a website called "Mentor Meet", a platform connecting students and mentors.
// Classify the user's message strictly as one of these categories: issue, request, help, or other.
// Respond with exactly one word ONLY: "issue", "request", "help", or "other".
// Here are some examples:
// - If the user reports a problem, respond with "issue".
// - If the user asks for something or makes a request, respond with "request".
// - If the user is asking for assistance or guidance, respond with "help".
// - If the message does not fit the above categories, respond with "other".
// `;
//   const res = await fetch("https://api.openai.com/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: prompt.trim(),
//         },
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//       temperature: 0,
//     }),
//   });
//   const data = (await res.json()) as OpenAIResponse;
//   const intentRaw = data.choices?.[0]?.message?.content;
//   if (typeof intentRaw !== "string") return "other";
//   const intent = intentRaw.toLowerCase().trim();
//   if (["issue", "request", "help"].includes(intent)) return intent as any;
//   return "other";
// };
const detectIntent = async (message) => {
    var _a, _b, _c;
    const fetch = (await Promise.resolve().then(() => __importStar(require("node-fetch")))).default;
    const prompt = `
Чи \"Mentor Meet\" платформын туслах. Хэрэглэгчийн мессежийг дараах 4 ангиллаар ангил:
- асуудал (хэрвээ хэрэглэгч асуудал, алдаа, гомдол бичсэн бол)
- хүсэлт (ямар нэг зүйл хүссэн, шаардаж байгаа бол)
- тусламж (асуулт, зөвлөгөө, тусламж хүссэн бол)
- бусад (дээрх ангилалд хамаарахгүй бол)

Зөвхөн нэг үгээр, зөвхөн монголоор хариул: \"асуудал\", \"хүсэлт\", \"тусламж\", эсвэл \"бусад\".
Жишээ:
- \"Сайт ажиллахгүй байна\" → \"асуудал\"
- \"Би шинэ нууц үг хүсэж байна\" → \"хүсэлт\"
- \"Яаж бүртгүүлэх вэ?\" → \"тусламж\"
- \"Сайн байна уу?\" → \"бусад\"
`;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // эсвэл "gpt-4"
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
        }),
    });
    const data = (await res.json());
    const intentRaw = (_c = (_b = (_a = data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
    if (typeof intentRaw !== "string")
        return "бусад";
    const intent = intentRaw.toLowerCase().trim();
    if (["асуудал", "хүсэлт", "тусламж"].includes(intent))
        return intent;
    return "бусад";
};
exports.detectIntent = detectIntent;
