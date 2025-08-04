import { Request, Response } from "express";
import { MessageModel } from "../model/chat-model";
import { StudentModel } from "../model/student-model";
import { MentorModel } from "../model/mentor-model";
import { OpenAI } from "openai";

// OpenAI client үүсгэх
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Intent detection функц
const detectIntent = async (
  message: string
): Promise<"issue" | "request" | "help" | "other"> => {
  try {
    const messageLower = message.toLowerCase();

    // Хүсэлт (request) - ментор хүссэн, тусламж хүссэн
    if (
      messageLower.includes("хэрэгтэй") ||
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
      messageLower.includes("looking for")
    ) {
      return "request";
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
      return "help";
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
      return "issue";
    }

    // Бусад (other) - мэндчилгээ, ердийн яриа
    return "other";
  } catch (error) {
    console.error("Error in detectIntent:", error);
    return "other";
  }
};

// AI хариу үүсгэх функц (OpenAI API ашиглаж)
const generateAIResponse = async (
  userMessage: string,
  intent: string
): Promise<string> => {
  try {
    // OpenAI байхгүй бол энгийн хариу буцаах
    if (!openai) {
      return generateSimpleResponse(userMessage);
    }
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

    const response = await openai.chat.completions.create({
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

    return (
      response.choices[0].message.content ||
      "Уучлаарай, хариу бэлдэхэд алдаа гарлаа."
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    // API алдаа гарвал энгийн хариу өгөх
    return generateSimpleResponse(userMessage);
  }
};

// Энгийн хариу үүсгэх функц (fallback)
const generateSimpleResponse = (userMessage: string): string => {
  const messageLower = userMessage.toLowerCase();

  // Мэндчилгээ
  if (
    messageLower.includes("сайн") ||
    messageLower.includes("hello") ||
    messageLower.includes("hi") ||
    messageLower.includes("мэнд")
  ) {
    return "Сайн байна уу! Mentor Meet платформд тавтай морил! Би танд тусламж үзүүлэхэд бэлэн байна.";
  }

  // Програмчлалын талаар
  if (
    messageLower.includes("программ") ||
    messageLower.includes("код") ||
    messageLower.includes("технологи") ||
    messageLower.includes("python") ||
    messageLower.includes("javascript") ||
    messageLower.includes("java") ||
    messageLower.includes("react") ||
    messageLower.includes("node")
  ) {
    return "Программчлалын талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд JavaScript, Python, React, Node.js зэрэг технологиудыг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Хууль, эрх зүй
  if (
    messageLower.includes("хууль") ||
    messageLower.includes("эрх") ||
    messageLower.includes("law") ||
    messageLower.includes("legal")
  ) {
    return "Хууль, эрх зүйн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд хууль, эрх зүйн асуудлуудыг тайлбарлахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Эрүүл мэнд
  if (
    messageLower.includes("эрүүл") ||
    messageLower.includes("анагаах") ||
    messageLower.includes("health") ||
    messageLower.includes("medical")
  ) {
    return "Эрүүл мэндийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд эрүүл мэндийн зөвлөгөө өгөхөд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Дизайн
  if (
    messageLower.includes("дизайн") ||
    messageLower.includes("график") ||
    messageLower.includes("design") ||
    messageLower.includes("art")
  ) {
    return "Дизайн, графикийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд UI/UX дизайн, график дизайн зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Бизнес
  if (
    messageLower.includes("бизнес") ||
    messageLower.includes("менеджмент") ||
    messageLower.includes("business") ||
    messageLower.includes("management")
  ) {
    return "Бизнес, менежментийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд бизнес стратеги, менежмент зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Ментор хүсэлт
  if (
    messageLower.includes("ментор") ||
    messageLower.includes("хэрэгтэй") ||
    messageLower.includes("туслах") ||
    messageLower.includes("заах")
  ) {
    return "Ментор хүсэж байна! Манай платформ дээр олон төрлийн чиглэлээр мэргэшсэн менторууд байна. Тэд танд тусламж үзүүлэхэд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Асуулт
  if (
    messageLower.includes("яаж") ||
    messageLower.includes("хэрхэн") ||
    messageLower.includes("юу") ||
    messageLower.includes("?") ||
    messageLower.includes("how") ||
    messageLower.includes("what")
  ) {
    return "Сайн асуулт байна! Манай платформ дээр олон төрлийн мэдээлэл, зөвлөгөө байна. Тодорхой асуултаа тавьж, би танд тусламж үзүүлэх боломжтой.";
  }

  // Ерөнхий хариу
  return "Сайн байна уу! Таны асуултад хариулахад баяртай байна. Манай платформ дээр ширээтэн менторууд байна. Тэд танд тусламж үзүүлэхэд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
};

export const getMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Мессежүүд авах үед алдаа гарлаа." });
  }
};

export const creatMessage = async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;
    const intent = await detectIntent(message);
    const aiReply = await generateAIResponse(message, intent);
    res.status(200).json({ aiReply });
  } catch (err) {
    console.error("createMessage error:", err);
    res.status(500).json({ error: "Мессеж хадгалах үед алдаа гарлаа" });
  }
};
