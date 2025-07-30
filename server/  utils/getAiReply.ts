import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getAiReply = async (userMessage: string): Promise<string> => {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for Mentor Meet. Give helpful, respectful, and concise replies to students or mentors.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
    });

    return res.choices[0].message.content || "Хариу бэлдэхэд алдаа гарлаа.";
  } catch (err) {
    console.error("AI хариу алдаа:", err);
    return "AI хариу бэлдэхэд алдаа гарлаа.";
  }
};