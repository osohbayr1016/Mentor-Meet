import { OpenAI } from "openai";
import { IntentType } from "./detectIntent";

// Create single OpenAI client instance to avoid memory leaks
let openaiClient: OpenAI | null = null;
const getOpenAIClient = (): OpenAI => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient!;
};

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

// =======================
// Optimized Category keyword map - Reduced for memory efficiency
// =======================
export const categoryKeywordMap: Record<string, string[]> = {
  "Программчлал ба Технологи": [
    "программ",
    "код",
    "technology",
    "developer",
    "software",
    "javascript",
    "python",
    "web",
    "app",
  ],
  Дизайн: ["дизайн", "ux", "ui", "design", "figma"],
  "Бизнес ба Менежмент": ["бизнес", "менежмент", "business", "management"],
  Маркетинг: ["маркетинг", "marketing", "зар", "social"],
  Санхүү: ["санхүү", "finance", "мөнгө", "banking"],
  Инженерчлэл: ["инженер", "engineer", "engineering"],
  "Хууль ба Эрх зүй": ["хууль", "law", "legal", "lawyer"],
  "Спорт ба Фитнес": ["спорт", "fitness", "exercise"],
  "Эрүүл мэнд": ["эрүүл", "health", "medical", "doctor"],
  Боловсрол: ["боловсрол", "education", "teacher"],
};

// =======================
// MAIN ENTRY
// =======================
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
  if (!mentors) return [];

  // Хэрэв category олдсон бол тухайн category-ийн менторуудыг эхэнд тавих
  if (matchedCategory) {
    const categoryMentors = mentors.filter(
      (m) =>
        m.category?.categoryId?.toLowerCase() === matchedCategory.toLowerCase()
    );

    // Category-ийн менторууд байвал тэднийг эхэнд тавих
    if (categoryMentors.length > 0) {
      return categoryMentors.slice(0, 3);
    }
  }

  // Хэрэв category олдохгүй эсвэл тухайн category-ийн ментор байхгүй бол
  // бүх менторуудаас хамгийн тохирохыг сонгох
  const messageLower = message.toLowerCase();

  // Менторуудыг тохирох байдлаар эрэмбэлэх
  const scoredMentors = mentors.map((mentor) => {
    let score = 0;

    // Професс, bio, category-д keyword хайх
    const mentorText = [
      mentor.profession || "",
      mentor.bio || "",
      mentor.category?.categoryId || "",
      `${mentor.firstName || ""} ${mentor.lastName || ""}`,
    ]
      .join(" ")
      .toLowerCase();

    // Keyword-үүдийг шалгах - илүү ухаалаг оноо өгөх
    for (const [category, keywords] of Object.entries(categoryKeywordMap)) {
      for (const keyword of keywords) {
        if (messageLower.includes(keyword) && mentorText.includes(keyword)) {
          // Яг тохирох keyword олдсон бол илүү өндөр оноо
          if (keyword.length > 3) {
            score += 3;
          } else {
            score += 1;
          }
        }
      }
    }

    // Category тохирсон бол нэмэлт оноо
    if (
      matchedCategory &&
      mentor.category?.categoryId?.toLowerCase() ===
        matchedCategory.toLowerCase()
    ) {
      score += 10; // Category тохирсон бол хамгийн өндөр оноо
    }

    // Менторын туршлагатай бол нэмэлт оноо
    if (mentor.experience?.careerDuration) {
      const years = parseInt(mentor.experience.careerDuration);
      if (years >= 5) score += 2;
      else if (years >= 3) score += 1;
    }

    // Дундаж үнэлгээ өндөр бол нэмэлт оноо
    if (mentor.averageRating && mentor.averageRating >= 4.0) {
      score += 1;
    }

    return { mentor, score };
  });

  // Оноогоор эрэмбэлээд хамгийн тохирох 3-г авах
  return scoredMentors
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.mentor);
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
  const openai = getOpenAIClient();

  const studentInfo = studentProfile
    ? `Сурагчийн мэдээлэл: ${studentProfile.name || "Нэргүй"}, ${
        studentProfile.email || ""
      }`
    : "Сурагчийн мэдээлэл байхгүй.";

  // Limit mentors info to prevent memory issues
  const limitedMentors = (mentors || []).slice(0, 5).map((m) => ({
    name: `${m.firstName || ""} ${m.lastName || ""}`.trim(),
    profession: m.profession || "",
    category: m.category?.categoryId || "",
  }));
  const mentorsInfo = JSON.stringify(limitedMentors);

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
    response.choices[0].message.content ||
    "AI хариу боловсруулахад алдаа гарлаа."
  );
};

// =======================
// Simple rule-based only fallback
// =======================
export const getSimpleResponse = (message: string): string => {
  return getRuleBasedResponseWithMentors(message.toLowerCase());
};
