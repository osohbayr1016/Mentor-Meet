import { OpenAI } from "openai";

export type IntentType = "асуудал" | "хүсэлт" | "тусламж" | "бусад";

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export const detectIntent = async (message: string): Promise<IntentType> => {
  try {
    const messageLower = message.toLowerCase();

    // Хүсэлт (request) - ментор хүссэн, тусламж хүссэн
    if (
      messageLower.includes("хэрэгтэй") ||
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
      messageLower.includes("looking for")
    ) {
      return "хүсэлт";
    }

    // Тусламж (help) - асуулт, зөвлөгөө
    if (
      messageLower.includes("асуулт") ||
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
      messageLower.includes("which")
    ) {
      return "тусламж";
    }

    // Асуудал (issue) - алдаа, гомдол, санаа зовниж байгаа
    if (
      messageLower.includes("алдаа") ||
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
      messageLower.includes("complaint")
    ) {
      return "асуудал";
    }

    // Бусад (other) - мэндчилгээ, ердийн яриа
    return "бусад";
  } catch (error) {
    console.error("Error in detectIntent:", error);
    return "бусад";
  }
};

// AI-powered intent detection (alternative method)
export const detectIntentWithAI = async (
  message: string
): Promise<IntentType> => {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      console.log("OpenAI API key not configured, using fallback detection");
      return detectIntent(message);
    }
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const response = await openai.chat.completions.create({
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

    const intentRaw = response.choices?.[0]?.message?.content;
    if (typeof intentRaw !== "string") return "бусад";

    const intent = intentRaw.toLowerCase().trim();
    if (["асуудал", "хүсэлт", "тусламж"].includes(intent)) {
      return intent as IntentType;
    }

    return "бусад";
  } catch (error) {
    console.error("Error in detectIntentWithAI:", error);
    // Fallback to rule-based detection
    return detectIntent(message);
  }
};
