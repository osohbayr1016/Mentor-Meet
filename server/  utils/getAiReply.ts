import { OpenAI } from "openai";
import { MentorModel } from "../model/mentor-model";

declare const process: any;

export const getAiReply = async (
  userMessage: string,
  intent?: string,
  userEmail?: string
): Promise<string> => {
  // OpenAI API key шалгах
  const openaiApiKey = process.env.OPENAI_API_KEY;
  console.log("OpenAI API Key exists:", !!openaiApiKey);

  if (!openaiApiKey) {
    console.log("OpenAI API key not found in environment variables");
    return generateSimpleFallbackResponse(userMessage);
  }

  try {
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // MongoDB-оос mentor-уудыг авах
    let mentors: any[] = [];
    try {
      mentors = await MentorModel.find({});
    } catch (error) {
      console.error("Error fetching mentors:", error);
      mentors = [];
    }

    // Асуултын агуулгад тулгуурлан тохирох менторуудыг сонгох
    const relevantMentors = mentors.filter((mentor) => {
      const mentorInfo =
        `${mentor.firstName} ${mentor.lastName} ${mentor.bio} ${mentor.profession} ${mentor.category?.categoryId}`.toLowerCase();
      const messageLower = userMessage.toLowerCase();

      // Хайлтын түлхүүр үгс
      const keywords = [
        "программ",
        "код",
        "технологи",
        "software",
        "developer",
        "coding",
        "хууль",
        "эрх",
        "law",
        "legal",
        "эрүүл",
        "анагаах",
        "health",
        "medical",
        "дизайн",
        "график",
        "design",
        "art",
        "спорт",
        "фитнес",
        "sport",
        "fitness",
        "бизнес",
        "менеджмент",
        "business",
        "management",
        "санхүү",
        "хөрөнгө",
        "finance",
        "money",
      ];

      return keywords.some(
        (keyword) =>
          mentorInfo.includes(keyword) && messageLower.includes(keyword)
      );
    });

    // Хэрэв тохирох ментор олдсонгүй бол бүх менторуудаас санамсаргүй сонгох
    const selectedMentors =
      relevantMentors.length > 0
        ? relevantMentors.slice(0, 3)
        : mentors.slice(0, 3);

    const prompt = `
Чи "Mentor Meet" платформын AI туслах. Хэрэглэгчийн асуултад тусламж үзүүл.

Хэрэглэгчийн асуулт: "${userMessage}"
${intent ? `Асуултын төрөл: ${intent}` : ""}

Тохирох менторууд:
${selectedMentors
  .map(
    (m) =>
      `- ${m.firstName || ""} ${m.lastName || ""}: ${m.bio} (Мэргэжил: ${
        m.profession
      }, Туршлага: ${m.experience?.careerDuration || ""}, Чиглэл: ${
        m.category?.categoryId || ""
      })`
  )
  .join("\n")}

Хэрэглэгчид тусламж үзүүлж, хэрэв mentor-уудтай холбоотой асуулт бол тохирох mentor-уудыг санал болго. Хариултаа зөвхөн монголоор бич.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Чи Mentor Meet платформын туслах чатбот. Хариултаа зөвхөн монголоор бич.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiResponse = response.choices[0].message.content;

    if (aiResponse) {
      return aiResponse;
    } else {
      // Fallback хариу - AI ажиллахгүй байсан ч сайн хариу өгөх
      return generateSimpleFallbackResponse(userMessage);
    }
  } catch (error) {
    console.error("getAiReply алдаа:", error);
    // Fallback хариу
    return generateSimpleFallbackResponse(userMessage);
  }
};

// Fallback хариу үүсгэх функц
const generateFallbackResponse = (
  userMessage: string,
  mentors: any[]
): string => {
  const messageLower = userMessage.toLowerCase();

  // Асуултын төрлөөс хамааран хариу өгөх
  if (
    messageLower.includes("программ") ||
    messageLower.includes("код") ||
    messageLower.includes("технологи")
  ) {
    return `Программчлалын талаар асуулт байна! Манай платформ дээр ${mentors.length} ширээтэн ментор байна. Тэд танд JavaScript, Python, React, Node.js зэрэг технологиудыг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  if (messageLower.includes("хууль") || messageLower.includes("эрх")) {
    return `Хууль, эрх зүйн талаар асуулт байна! Манай платформ дээр ${mentors.length} ширээтэн ментор байна. Тэд танд хууль, эрх зүйн асуудлуудыг тайлбарлахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  if (messageLower.includes("эрүүл") || messageLower.includes("анагаах")) {
    return `Эрүүл мэндийн талаар асуулт байна! Манай платформ дээр ${mentors.length} ширээтэн ментор байна. Тэд танд эрүүл мэндийн зөвлөгөө өгөхөд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  if (messageLower.includes("дизайн") || messageLower.includes("график")) {
    return `Дизайн, графикийн талаар асуулт байна! Манай платформ дээр ${mentors.length} ширээтэн ментор байна. Тэд танд UI/UX дизайн, график дизайн зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  if (messageLower.includes("бизнес") || messageLower.includes("менеджмент")) {
    return `Бизнес, менежментийн талаар асуулт байна! Манай платформ дээр ${mentors.length} ширээтэн ментор байна. Тэд танд бизнес стратеги, менежмент зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  // Ерөнхий хариу
  return `Сайн байна уу! Таны асуултад хариулахад баяртай байна. Манай платформ дээр ${mentors.length} ширээтэн ментор байна. Тэд танд тусламж үзүүлэхэд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
};

// Энгийн fallback хариу үүсгэх функц
const generateSimpleFallbackResponse = (userMessage: string): string => {
  const messageLower = userMessage.toLowerCase();

  // Асуултын төрлөөс хамааран хариу өгөх
  if (
    messageLower.includes("программ") ||
    messageLower.includes("код") ||
    messageLower.includes("технологи")
  ) {
    return `Программчлалын талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд JavaScript, Python, React, Node.js зэрэг технологиудыг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  if (messageLower.includes("хууль") || messageLower.includes("эрх")) {
    return `Хууль, эрх зүйн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд хууль, эрх зүйн асуудлуудыг тайлбарлахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  if (messageLower.includes("эрүүл") || messageLower.includes("анагаах")) {
    return `Эрүүл мэндийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд эрүүл мэндийн зөвлөгөө өгөхөд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  if (messageLower.includes("дизайн") || messageLower.includes("график")) {
    return `Дизайн, графикийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд UI/UX дизайн, график дизайн зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  if (messageLower.includes("бизнес") || messageLower.includes("менеджмент")) {
    return `Бизнес, менежментийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд бизнес стратеги, менежмент зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
  }

  // Ерөнхий хариу
  return `Сайн байна уу! Таны асуултад хариулахад баяртай байна. Манай платформ дээр ширээтэн менторууд байна. Тэд танд тусламж үзүүлэхэд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
};
