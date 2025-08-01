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
    const { email, message, studentProfile } = req.body;

    if (!email || !message) {
      return res
        .status(400)
        .json({ error: "Email болон message шаардлагатай!" });
    }

    const intent = await detectIntent(message);

    const allowedIntents = ["асуудал", "хүсэлт", "тусламж"];
    if (!allowedIntents.includes(intent)) {
      return res.status(400).json({
        error: `'${intent}' intent дэмжигдэхгүй байна. Зөвшөөрөгдсөн утгууд: асуудал, хүсэлт, тусламж.`,
      });
    }

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

    const aiReply = await getAiReply(message).catch(
      () => "Уучлаарай, асуултад одоогоор хариулж чадсангүй."
    );

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
    console.error(" createMessage error:", err);
    res.status(500).json({ error: "Мессеж хадгалах үед алдаа гарлаа" });
  }
};

export const chatAssistant = async (req: Request, res: Response) => {
  try {
    const { message, studentProfile } = req.body;

    const mentors = await MentorModel.find({});

    const prompt = `
Сурагчийн мэдээлэл:
${JSON.stringify(studentProfile, null, 2)}

Боломжит менторууд:
${mentors
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

    res.json({ reply: aiRes.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI-тай холбогдоход алдаа гарлаа." });
  }
};
