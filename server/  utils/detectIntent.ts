import { OpenAI } from "openai";
import { MentorModel } from "../model/mentor-model";
import { StudentModel } from "../model/student-model";

declare const process: any;

type OpenAIResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

// MongoDB-оос mentor-уудыг авах
const getMentorsFromDB = async () => {
  try {
    const mentors = await MentorModel.find({});
    return mentors;
  } catch (error) {
    console.error("Mentor-уудыг авахад алдаа:", error);
    return [];
  }
};

// MongoDB-оос student-ийн мэдээллийг авах
const getStudentFromDB = async (email: string) => {
  try {
    const student = await StudentModel.findOne({ email });
    return student;
  } catch (error) {
    console.error("Student мэдээлэл авахад алдаа:", error);
    return null;
  }
};

export const detectIntent = async (
  message: string,
  userEmail?: string // хэрэглэгчийн email
): Promise<"асуудал" | "хүсэлт" | "тусламж" | "бусад"> => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY тохируулаагүй байна");
      return "бусад";
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // MongoDB-оос өгөгдөл авах
    const mentors = await getMentorsFromDB();
    const student = userEmail ? await getStudentFromDB(userEmail) : null;

    const prompt = `
Чи "Mentor Meet" платформын AI туслах. Хэрэглэгчийн мессежийг дараах 4 ангиллаар ангил:

- асуудал: хэрэглэгч асуудал, алдаа, гомдол, санаа зовниж байгаа бол
- хүсэлт: ямар нэг зүйл хүссэн, шаардаж, хүсэлт гаргаж байгаа бол  
- тусламж: асуулт, зөвлөгөө, тусламж, заавар хүссэн бол
- бусад: дээрх ангилалд хамаарахгүй, ердийн яриа, мэндчилгээ гэх мэт

${
  student
    ? `Хэрэглэгчийн мэдээлэл: ${student.nickname || "Unknown"}, ${
        student.email
      }`
    : ""
}
${mentors.length > 0 ? `Боломжит менторуудын тоо: ${mentors.length}` : ""}

Зөвхөн нэг үгээр, зөвхөн монголоор хариул: "асуудал", "хүсэлт", "тусламж", эсвэл "бусад".

Жишээ:
- "Сайт ажиллахгүй байна" → "асуудал"
- "Би шинэ нууц үг хүсэж байна" → "хүсэлт"  
- "Яаж бүртгүүлэх вэ?" → "тусламж"
- "Сайн байна уу?" → "бусад"
- "Баяртай" → "бусад"
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
      max_tokens: 10,
    });

    const intentRaw = response.choices?.[0]?.message?.content;

    if (typeof intentRaw !== "string") {
      console.error("AI-аас буруу хариу ирлээ:", intentRaw);
      return "бусад";
    }

    const intent = intentRaw.toLowerCase().trim();

    if (["асуудал", "хүсэлт", "тусламж"].includes(intent)) {
      return intent as any;
    }

    console.log(`Unknown intent: "${intent}" from message: "${message}"`);
    return "бусад";
  } catch (error) {
    console.error("detectIntent алдаа:", error);
    return "бусад";
  }
};
