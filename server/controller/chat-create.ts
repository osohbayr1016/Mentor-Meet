import { Request, Response } from "express";
import { MessageModel } from "../model/chat-model";
import { StudentModel } from "../model/student-model";
import { MentorModel } from "../model/mentor-model";
import { detectIntent } from "../  utils/detectIntent";
import { getAiReply } from "../  utils/getAiReply";
import { OpenAI } from "openai";

export const getMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find().sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Мессежүүд авах үед алдаа гарлаа." });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    // OpenAI API key шалгах
    console.log(
      "OPENAI_API_KEY:",
      process.env.OPENAI_API_KEY ? "Байна" : "Байхгүй"
    );

    if (!email || !message) {
      return res
        .status(400)
        .json({ error: "Email болон message шаардлагатай!" });
    }

    // detectIntent-д email дамжуулах
    const intent = await detectIntent(message, email);

    const allowedIntents = [""];
    if (!allowedIntents.includes(intent)) {
      return res.status(400).json({
        error: `'${intent}' intent дэмжигдэхгүй байна. Зөвшөөрөгдсөн утгууд: асуудал, хүсэлт, тусламж.`,
      });
    }

    // MongoDB-оос student-ийн мэдээллийг авах
    const student = await StudentModel.findOne({ email });
    const mentor = await MentorModel.findOne({ email });

    let senderType = "";
    if (student) senderType = "student";
    else if (mentor) senderType = "mentor";
    else senderType = "unknown";

    const userMsg = await MessageModel.create({
      email,
      message,
      senderType,
      intent,
    });

    // getAiReply-д зөвхөн message, intent, email дамжуулах
    let aiReply;
    try {
      aiReply = await getAiReply(message, intent, email);
    } catch (error) {
      console.error("AI Reply error:", error);
      // Fallback response үүсгэх
      aiReply = generateFallbackResponse(message);
    }

    if (req.query.save !== "true") {
      return res.status(201).json({
        messages: [
          userMsg,
          {
            email: "bot@mentormeet.mn",
            message: aiReply,
            senderType: "bot",
            intent: "бусад",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });
    }

    const botMsg = await MessageModel.create({
      email: "bot@mentormeet.mn",
      message: aiReply,
      senderType: "bot",
      intent: "бусад",
    });

    res.status(201).json({
      messages: [userMsg, botMsg],
    });
  } catch (err) {
    console.error("createMessage error:", err);
    res.status(500).json({ error: "Мессеж хадгалах үед алдаа гарлаа" });
  }
};

// Fallback хариу үүсгэх функц
const generateFallbackResponse = (userMessage: string): string => {
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

export const chatAssistant = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const mentors = await MentorModel.find({});

    // Асуултын агуулгад тулгуурлан тохирох менторуудыг сонгох
    const relevantMentors = mentors.filter((mentor) => {
      const mentorInfo =
        `${mentor.firstName} ${mentor.lastName} ${mentor.bio} ${mentor.profession} ${mentor.category?.categoryId}`.toLowerCase();
      const messageLower = message.toLowerCase();

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
Боломжит менторууд:
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

Сурагчийн асуулт:
"${message}"

Чи Mentor Meet платформын AI туслах. Сурагчид хамгийн тохиромжтой ментор(ууд)-ыг сонгож, яагаад тохирохыг товч тайлбарла. Хариултаа зөвхөн монголоор бич.
    `;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const aiRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Чи Mentor Meet платформын туслах чатбот." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    res.json({
      reply: aiRes.choices[0].message.content,
      suggestedMentors: selectedMentors,
      totalMentors: mentors.length,
      relevantMentors: relevantMentors.length,
    });
  } catch (err) {
    res.status(500).json({ error: "AI-тай холбогдоход алдаа гарлаа." });
  }
};

export const suggestMentors = async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res
        .status(400)
        .json({ error: "Email болон message шаардлагатай!" });
    }

    // MongoDB-оос mentor-уудыг авах
    const mentors = await MentorModel.find({});

    // Асуултын агуулгад тулгуурлан тохирох менторуудыг сонгох
    const relevantMentors = mentors.filter((mentor) => {
      const mentorInfo =
        `${mentor.firstName} ${mentor.lastName} ${mentor.bio} ${mentor.profession} ${mentor.category?.categoryId}`.toLowerCase();
      const messageLower = message.toLowerCase();

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
Боломжит менторууд:
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

Сурагчийн асуулт:
"${message}"

Чи Mentor Meet платформын AI туслах. Сурагчид хамгийн тохиромжтой ментор(ууд)-ыг сонгож, яагаад тохирохыг товч тайлбарла. Хариултаа зөвхөн монголоор бич.
    `;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const aiRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Чи Mentor Meet платформын туслах чатбот." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    res.json({
      reply: aiRes.choices[0].message.content,
      mentors: selectedMentors,
      totalMentors: mentors.length,
      relevantMentors: relevantMentors.length,
    });
  } catch (err) {
    console.error("suggestMentors error:", err);
    res.status(500).json({ error: "Mentor санал болгоход алдаа гарлаа." });
  }
};

// Зөвхөн асуултад тулгуурлан ментор санал болгох функц
export const getMentorsByQuestion = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Асуулт шаардлагатай!" });
    }

    // MongoDB-оос mentor-уудыг авах
    const mentors = await MentorModel.find({});

    // Асуултын агуулгад тулгуурлан тохирох менторуудыг сонгох
    const relevantMentors = mentors.filter((mentor) => {
      const mentorInfo =
        `${mentor.firstName} ${mentor.lastName} ${mentor.bio} ${mentor.profession} ${mentor.category?.categoryId}`.toLowerCase();
      const messageLower = message.toLowerCase();

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
        ? relevantMentors.slice(0, 5)
        : mentors.slice(0, 5);

    res.json({
      mentors: selectedMentors,
      totalMentors: mentors.length,
      relevantMentors: relevantMentors.length,
      message: message,
    });
  } catch (err) {
    console.error("getMentorsByQuestion error:", err);
    res.status(500).json({ error: "Менторуудыг хайхад алдаа гарлаа." });
  }
};
