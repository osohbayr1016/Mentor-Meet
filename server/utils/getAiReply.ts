
import { OpenAI } from "openai";
import { IntentType } from "./detectIntent";

// =======================
// Interfaces
// =======================
export interface StudentProfile {
  name?: string;
  email: string;
  phoneNumber?: string;
  goal?: string;
  level?: string;
}

export interface Feedback {
  studentEmail: string;
  mentorId: string;
  rating: number; // 1-5
  comment?: string;
  date: string; // ISO date string
}

export interface MentorInfo {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profession?: string;
  experience?: {
    careerDuration?: string;
  };
  category?: {
    categoryId?: string;
  };
   feedbacks?: Feedback[]; 
  averageRating?: number;
}



export const calculateAverageRating = (feedbacks?: Feedback[]): number => {
  if (!feedbacks || feedbacks.length === 0) return 0;
  const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
  return parseFloat((sum / feedbacks.length).toFixed(2));
};




const analyzeMentorQuality = async (feedbacks: Feedback[]): Promise<string> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const comments = feedbacks.map(fb => fb.comment).filter(Boolean).join("\n");

  const prompt = `
  Та дараах менторын сэтгэгдэлүүдийг уншаад чанарын талаар товч дүгнэлт өгнө үү:
  ${comments}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Та менторын чанарын шинжээч юм." },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
  });

  return response.choices[0].message.content || "Дүгнэлт авах боломжгүй байна.";
};

// =======================
// Category keyword map
// =======================
export const categoryKeywordMap: Record<string, string[]> = {
  "Программчлал ба Технологи": ["программ", "код", "technology", "developer", "software", "технологи", "javascript", "python"],
  "Дизайн": ["дизайн", "график", "ux", "ui", "design"],
  "Бизнес ба Менежмент": ["бизнес", "менежмент", "startup", "business"],
  "Маркетинг": ["маркетинг", "зар", "сошиал", "marketing"],
  "Санхүү": ["санхүү", "мөнгө", "төсөв", "finance"],
  "Инженерчлэл": ["инженер", "инженерчлэл"],
  "Урлаг": ["урлаг", "уран", "art"],
  "Computer Science": ["computer", "cs", "informatics", "informatics"],
  "Хууль ба Эрх зүй": ["хууль", "эрх", "law"],
  "Спорт ба Фитнес": ["спорт", "фитнес", "exercise", "биеийн"],
  "Захиргаа, хүний нөөц": ["захиргаа", "hr", "хүний нөөц"],
  "Барилга ба Архитектур": ["барилга", "архитектур"],
  "Уул уурхай": ["уул", "уурхай", "mining"],
  "Аялал жуулчлал, хоол үйлдвэрлэл": ["аялал", "хоол", "жуулчлал"],
  "Гэрэл зураг": ["гэрэл", "зураг", "фото", "photo"],
  "Эрүүл мэнд ба Анагаах ухаан": ["эрүүл", "анагаах", "health", "эмч"],
  "Боловсрол ба Сургалт": ["сургалт", "боловсрол", "сургууль"],
  "Хөдөө аж ахуй": ["хөдөө", "мал", "тарилга", "farmer"],
  "Байгаль орчин": ["байгаль", "eco", "эколог", "тогтвортой"],
  "Тээвэр ба Логистик": ["тээвэр", "логистик", "ачаалал"],
  "Үйлчилгээ ба Худалдаа": ["үйлчилгээ", "худалдаа", "sales"],
  "Мэдээлэл ба Хэвлэл": ["мэдээлэл", "хэвлэл", "сэтгүүл"],
  "Үйлдвэрлэл ба Технологи": ["үйлдвэр", "технологи", "техник"],
  "Сэргээгдэх эрчим хүч": ["сэргээгдэх", "эрчим", "нар", "цахилгаан"],
  "Боловсрол, шинжлэх ухаан": ["шинжлэх", "science", "боловсрол"],
};



// =======================
// MAIN ENTRY
// =======================
// export const getAiReply = async (
//   userMessage: string,
//   intent?: IntentType,
//   studentProfile?: StudentProfile,
//   mentors?: MentorInfo[]
// ): Promise<string> => {
//   const messageLower = userMessage.toLowerCase();

//   try {
//     if (process.env.OPENAI_API_KEY && mentors && mentors.length > 0) {
//       return await getAIResponse(userMessage, intent, studentProfile, mentors);
//     }

//     return getRuleBasedResponseWithMentors(messageLower, mentors);
//   } catch (error) {
//     console.error("Error in getAiReply:", error);
//     return getRuleBasedResponseWithMentors(messageLower, mentors);
//   }
// };

const complaintKeywords = [
  "гомдол",
  "санаа зовнил",
  "алдаа",
  "буруу",
  "санаа",
  "сэтгэл дундуур",
  "муу",
  "сэтгэл гонсойлгох",
  "санаа зовох",
];

const isComplaintOrFeedback = (message: string): boolean => {
  const msg = message.toLowerCase();
  return complaintKeywords.some((kw) => msg.includes(kw));
};

const getComplaintResponse = (): string => {
  return `Таны санал, гомдлыг хүлээн авлаа. Бид үүнийг сайжруулахад анхааралтай хандах болно. Таны үнэлгээ, зөвлөгөөг бид үнэлж байна. Баярлалаа!`;
};


export const getAiReply = async (
  userMessage: string,
  intent?: IntentType,
  studentProfile?: StudentProfile,
  mentors?: MentorInfo[]
): Promise<string> => {
  const messageLower = userMessage.toLowerCase();

  try {
    // Хэрвээ гомдол, санал байвал шууд тусгай хариу буцаах
    if (isComplaintOrFeedback(messageLower)) {
      return getComplaintResponse();
    }

    if (process.env.OPENAI_API_KEY && mentors && mentors.length > 0) {
      return await getAIResponse(userMessage, intent, studentProfile, mentors);
    }

    return getRuleBasedResponseWithMentors(messageLower, mentors);
  } catch (error) {
    console.error("Error in getAiReply:", error);
    return getRuleBasedResponseWithMentors(messageLower, mentors);
  }
};

// =======================
// Detect category dynamically
// =======================
const getCategoryFromMessage = (message: string): string | null => {
  for (const [category, keywords] of Object.entries(categoryKeywordMap)) {
    if (keywords.some((kw) => message.includes(kw))) {
      return category;
    }
  }
  return null;
};

// =======================
// Get relevant mentors
// =======================
const getRelevantMentors = (
  message: string,
  mentors?: MentorInfo[]
): MentorInfo[] => {
  const matchedCategory = getCategoryFromMessage(message);
  if (!mentors || !matchedCategory) return mentors?.slice(0, 3) || [];

  return mentors
    .filter((m) =>
      m.category?.categoryId?.toLowerCase() === matchedCategory.toLowerCase()
    )
    .slice(0, 3);
};

// =======================
// Format mentor text
// =======================
const formatMentorSuggestions = (
  mentors: MentorInfo[],
  category: string
): string => {
  if (!mentors.length) {
    return " Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  const list = mentors
    .map((m) => {
      const name = `${m.firstName || ""} ${m.lastName || ""}`.trim();
      const prof = m.profession || "Ментор";
      const exp = m.experience?.careerDuration
        ? `, ${m.experience.careerDuration} жил туршлагатай`
        : "";
      return `• ${name} (${prof}${exp})`;
    })
    .join("\n");

  return `\n\n${category} чиглэлээр санал болгох менторууд:\n${list}\n\nТэдний профайлыг үзэж холбогдоорой.`;
};

// =======================
// Rule-based fallback (dynamic)
// =======================
const getRuleBasedResponseWithMentors = (
  message: string,
  mentors?: MentorInfo[]
): string => {
  const category = getCategoryFromMessage(message);
  const relevantMentors = getRelevantMentors(message, mentors);
  const suggestions = formatMentorSuggestions(
    relevantMentors,
    category || "Ерөнхий"
  );

  if (category) {
    return `${category} чиглэлээр таны сонирхол илэрхийлэгдсэн байна.${suggestions}`;
  }

  return `Таны илгээсэн мэдээлэлд үндэслэн дараах менторуудыг санал болгож байна.${suggestions}`;
};

// =======================
// AI-powered reply
// =======================
const getAIResponse = async (
  userMessage: string,
  intent?: IntentType,
  studentProfile?: StudentProfile,
  mentors?: MentorInfo[]
): Promise<string> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const studentInfo = studentProfile
    ? `Сурагчийн мэдээлэл:\n${JSON.stringify(studentProfile, null, 2)}`
    : "Сурагчийн мэдээлэл байхгүй.";

  const mentorsInfo = JSON.stringify(mentors || [], null, 2);

  const prompt = `
${studentInfo}

Менторуудын мэдээлэл:
${mentorsInfo}

Сурагчийн асуулт: "${userMessage}"
Intent: ${intent || "unknown"}

Чи Mentor Meet платформын AI туслах. Хэрэглэгчийн илгээсэн асуулт болон профайлын мэдээлэл дээр үндэслэн хамгийн тохирох ментор(ууд)-ыг санал болго. Яагаад тохирох талаар товч тайлбар өг. Хариултаа зөвхөн монголоор бич.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Чи Mentor Meet платформын туслах чатбот.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  return (
    response.choices[0].message.content || "AI хариу боловсруулахад алдаа гарлаа."
  );
};

// =======================
// Simple rule-based only fallback
// =======================
export const getSimpleResponse = (message: string): string => {
  return getRuleBasedResponseWithMentors(message.toLowerCase());
};

