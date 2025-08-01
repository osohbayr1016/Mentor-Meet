import { OpenAI } from "openai";
import { MentorModel } from "../model/mentor-model";

declare const process: any;

export const getAiReply = async (
  userMessage: string,
  intent?: string,
  userEmail?: string
): Promise<string> => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return "Уучлаарай, AI үйлчилгээ одоогоор боломжгүй байна.";
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // MongoDB-оос mentor-уудыг авах
    const mentors = await MentorModel.find({});

    const prompt = `
Чи "Mentor Meet" платформын AI туслах. Хэрэглэгчийн асуултад тусламж үзүүл.

Хэрэглэгчийн асуулт: "${userMessage}"
${intent ? `Асуултын төрөл: ${intent}` : ""}

${mentors.length > 0 ? `Боломжит менторуудын тоо: ${mentors.length}` : ""}

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

    return (
      response.choices[0].message.content ||
      "Уучлаарай, хариу бэлдэхэд алдаа гарлаа."
    );
  } catch (error) {
    console.error("getAiReply алдаа:", error);
    return "Уучлаарай, AI үйлчилгээнд алдаа гарлаа. Дахин оролдоно уу.";
  }
};
