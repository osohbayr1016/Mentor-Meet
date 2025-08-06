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

// analyzeMentorQuality функц нь зөвхөн feedback дүн шинжилгээнд зориулагдсан
// Одоогийн AI хариу системд ашиглахгүй байна
// const analyzeMentorQuality = async (feedbacks: Feedback[]): Promise<string> => {
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
//   const comments = feedbacks.map(fb => fb.comment).filter(Boolean).join("\n");

//   const prompt = `
//   Та дараах менторын сэтгэгдэлүүдийг уншаад чанарын талаар товч дүгнэлт өгнө үү:
//   ${comments}
//   `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       { role: "system", content: "Та менторын чанарын шинжээч юм." },
//       { role: "user", content: prompt },
//     ],
//     temperature: 0.5,
//   });

//   return response.choices[0].message.content || "Дүгнэлт авах боломжгүй байна.";
// };

// =======================
// Category keyword map
// =======================
export const categoryKeywordMap: Record<string, string[]> = {
  "Программчлал ба Технологи": [
    "программ",
    "код",
    "technology",
    "developer",
    "software",
    "software engineer",
    "технологи",
    "javascript",
    "python",
    "java",
    "c++",
    "web development",
    "app development",
    "mobile app",
    "frontend",
    "backend",
    "fullstack",
    "database",
    "sql",
    "nosql",
    "api",
    "react",
    "angular",
    "vue",
    "node.js",
    "php",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
    "flutter",
    "react native",
  ],
  Дизайн: [
    "дизайн",
    "график",
    "ux",
    "ui",
    "design",
    "photoshop",
    "illustrator",
    "figma",
    "sketch",
  ],
  "Бизнес ба Менежмент": [
    "бизнес",
    "менежмент",
    "startup",
    "business",
    "project management",
    "product management",
  ],
  Маркетинг: [
    "маркетинг",
    "зар",
    "сошиал",
    "marketing",
    "digital marketing",
    "social media",
    "seo",
    "sem",
  ],
  Санхүү: [
    "санхүү",
    "мөнгө",
    "төсөв",
    "finance",
    "accounting",
    "investment",
    "banking",
  ],
  Инженерчлэл: [
    "инженер",
    "инженерчлэл",
    "engineer",
    "engineering",
    "mechanical engineer",
    "electrical engineer",
    "civil engineer",
    "hardware engineer",
    "system engineer",
    "network engineer",
    "data engineer",
    "devops engineer",
    "cloud engineer",
    "security engineer",
    "robotics engineer",
    "automation engineer",
    "process engineer",
    "quality engineer",
    "test engineer",
    "reliability engineer",
    "maintenance engineer",
    "project engineer",
    "field engineer",
    "application engineer",
    "sales engineer",
    "support engineer",
    "research engineer",
    "design engineer",
    "product engineer",
    "manufacturing engineer",
    "industrial engineer",
    "chemical engineer",
    "biomedical engineer",
    "environmental engineer",
    "structural engineer",
    "transportation engineer",
    "construction engineer",
    "mining engineer",
    "petroleum engineer",
    "nuclear engineer",
    "aerospace engineer",
    "marine engineer",
    "materials engineer",
    "energy engineer",
    "power engineer",
    "control engineer",
    "instrumentation engineer",
    "telecommunications engineer",
    "optical engineer",
    "semiconductor engineer",
    "embedded engineer",
    "firmware engineer",
    "rf engineer",
    "antenna engineer",
    "satellite engineer",
    "wireless engineer",
    "database engineer",
    "machine learning engineer",
    "ai engineer",
    "computer vision engineer",
    "nlp engineer",
    "game engineer",
    "graphics engineer",
    "streaming engineer",
    "cybersecurity engineer",
    "blockchain engineer",
    "fintech engineer",
    "algorithm engineer",
    "optimization engineer",
    "simulation engineer",
    "analytics engineer",
    "big data engineer",
    "distributed systems engineer",
    "performance engineer",
    "site reliability engineer",
    "platform engineer",
    "infrastructure engineer",
    "cloud architect engineer",
    "solution architect engineer",
    "api engineer",
    "search engineer",
    "recommendation engineer",
    "deployment engineer",
    "ci/cd engineer",
    "quality assurance engineer",
    "test automation engineer",
    "penetration testing engineer",
    "data modeling engineer",
    "data warehouse engineer",
    "etl engineer",
    "streaming data engineer",
    "knowledge management engineer",
    "natural language processing engineer",
    "speech recognition engineer",
    "chatbot engineer",
    "facial recognition engineer",
    "biometric engineer",
    "signal processing engineer",
    "image processing engineer",
    "video processing engineer",
    "audio processing engineer",
    "sensor fusion engineer",
    "kalman filter engineer",
    "fourier transform engineer",
    "pattern recognition engineer",
    "machine learning engineer",
    "deep learning engineer",
    "neural network engineer",
    "transformer engineer",
    "computer vision engineer",
    "robotics engineer",
    "autonomous systems engineer",
    "slam engineer",
    "point cloud engineer",
    "3d vision engineer",
  ],
  "Аудио ба Дууны инженерчлэл": [
    "sound engineer",
    "sound engineering",
    "аудио",
    "дуу",
    "микшер",
    "recording",
    "studio",
    "music production",
    "хөгжмийн",
    "дууны",
    "аудио инженер",
    "дууны инженер",
    "studio engineer",
    "mixing",
    "mastering",
    "pro tools",
    "ableton",
    "logic pro",
    "cubase",
    "fl studio",
  ],
  "Хэлний орчуулга ба Хэл сургалт": [
    "орчуулагч",
    "орчуулга",
    "хэл",
    "translation",
    "translator",
    "interpreter",
    "language",
    "english",
    "mongolian",
    "chinese",
    "russian",
    "korean",
    "japanese",
    "german",
    "french",
    "spanish",
    "хэлний",
    "орчуулагч",
    "толмач",
  ],
  Урлаг: [
    "урлаг",
    "уран",
    "art",
    "painting",
    "drawing",
    "sculpture",
    "music",
    "dance",
    "theater",
  ],
  "Computer Science": [
    "computer",
    "cs",
    "informatics",
    "algorithm",
    "data structure",
    "machine learning",
    "ai",
    "artificial intelligence",
  ],
  "Мэдээлэл зүй ба Data Science": [
    "data science",
    "data scientist",
    "data analysis",
    "data analytics",
    "statistics",
    "statistical analysis",
    "data visualization",
    "data mining",
    "data modeling",
    "predictive modeling",
    "business intelligence",
    "data warehousing",
    "data engineering",
    "data architecture",
    "data governance",
    "data quality",
    "data cleaning",
    "data preprocessing",
    "feature engineering",
    "model evaluation",
    "a/b testing",
    "experimental design",
    "hypothesis testing",
    "regression analysis",
    "classification",
    "clustering",
    "time series analysis",
    "natural language processing",
    "text mining",
    "sentiment analysis",
    "recommendation systems",
    "deep learning",
    "neural networks",
    "computer vision",
    "image processing",
    "big data",
    "hadoop",
    "spark",
    "sql",
    "python",
    "matlab",
    "tableau",
    "power bi",
    "excel",
    "jupyter",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "keras",
  ],
  "Хууль ба Эрх зүй": ["хууль", "эрх", "law", "legal", "attorney", "lawyer"],
  "Спорт ба Фитнес": [
    "спорт",
    "фитнес",
    "exercise",
    "биеийн",
    "fitness",
    "gym",
    "workout",
    "training",
  ],
  "Захиргаа, хүний нөөц": [
    "захиргаа",
    "hr",
    "хүний нөөц",
    "human resources",
    "administration",
  ],
  "Барилга ба Архитектур": [
    "барилга",
    "архитектур",
    "construction",
    "architecture",
  ],
  "Уул уурхай": ["уул", "уурхай", "mining", "geology", "mineral"],
  "Аялал жуулчлал": [
    "аялал",
    "жуулчлал",
    "tourism",
    "hotel",
    "restaurant",
    "travel",
    "tourist",
  ],
  "Хоол хийх ба Culinary Arts": [
    "хоол",
    "cooking",
    "chef",
    "culinary",
    "kitchen",
    "food preparation",
    "baking",
    "pastry",
    "cuisine",
    "restaurant",
    "catering",
    "food service",
    "menu planning",
    "food safety",
    "nutrition",
    "dietary",
    "meal planning",
    "recipe",
    "ingredients",
    "cooking techniques",
    "food presentation",
    "gastronomy",
    "molecular gastronomy",
    "fusion cuisine",
    "traditional cooking",
    "modern cooking",
    "professional cooking",
    "home cooking",
    "food styling",
    "food photography",
  ],
  "Гэрэл зураг": ["гэрэл", "зураг", "фото", "photo", "photography", "camera"],
  "Эрүүл мэнд ба Анагаах ухаан": [
    "эрүүл",
    "анагаах",
    "health",
    "эмч",
    "medical",
    "doctor",
    "nurse",
    "pharmacy",
  ],
  "Боловсрол ба Сургалт": [
    "сургалт",
    "боловсрол",
    "сургууль",
    "education",
    "teaching",
    "teacher",
    "tutor",
  ],
  "Хөдөө аж ахуй": [
    "хөдөө",
    "мал",
    "тарилга",
    "farmer",
    "agriculture",
    "farming",
  ],
  "Байгаль орчин": [
    "байгаль",
    "eco",
    "эколог",
    "тогтвортой",
    "environment",
    "ecology",
  ],
  "Тээвэр ба Логистик": [
    "тээвэр",
    "логистик",
    "ачаалал",
    "transport",
    "logistics",
    "supply chain",
  ],
  "Үйлчилгээ ба Худалдаа": [
    "үйлчилгээ",
    "худалдаа",
    "sales",
    "retail",
    "customer service",
  ],
  "Мэдээлэл ба Хэвлэл": [
    "мэдээлэл",
    "хэвлэл",
    "сэтгүүл",
    "media",
    "journalism",
    "news",
    "publishing",
  ],
  "Үйлдвэрлэл ба Технологи": [
    "үйлдвэр",
    "технологи",
    "техник",
    "manufacturing",
    "production",
  ],
  "Сэргээгдэх эрчим хүч": [
    "сэргээгдэх",
    "эрчим",
    "нар",
    "цахилгаан",
    "renewable energy",
    "solar",
    "wind",
  ],
  "Боловсрол, шинжлэх ухаан": [
    "шинжлэх",
    "science",
    "боловсрол",
    "research",
    "academic",
  ],
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

// export const getAiReply = async (
//   userMessage: string,
//   intent?: IntentType,
//   studentProfile?: StudentProfile,
//   mentors?: MentorInfo[]
// ): Promise<string> => {
//   const messageLower = userMessage.toLowerCase();

//   try {
//     // Хэрвээ гомдол, санал байвал шууд тусгай хариу буцаах
//     if (isComplaintOrFeedback(messageLower)) {
//       return getComplaintResponse();
//     }

//     if (process.env.OPENAI_API_KEY && mentors && mentors.length > 0) {
//       return await getAIResponse(userMessage, intent, studentProfile, mentors);
//     }

//     return getRuleBasedResponseWithMentors(messageLower, mentors);
//   } catch (error) {
//     console.error("Error in getAiReply:", error);
//     return getRuleBasedResponseWithMentors(messageLower, mentors);
//   }
// };

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
