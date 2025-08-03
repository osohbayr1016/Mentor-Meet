import { OpenAI } from "openai";
import { IntentType } from "./detectIntent";

export interface StudentProfile {
  name?: string;
  email: string;
  phoneNumber?: string;
  goal?: string;
  level?: string;
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
}

export const getAiReply = async (
  userMessage: string,
  intent?: IntentType,
  studentProfile?: StudentProfile,
  mentors?: MentorInfo[]
): Promise<string> => {
  const messageLower = userMessage.toLowerCase();

  try {
    // If we have OpenAI API key and mentors data, use AI-powered response
    if (process.env.OPENAI_API_KEY && mentors && mentors.length > 0) {
      return await getAIResponse(userMessage, intent, studentProfile, mentors);
    }

    // Fallback to rule-based responses with mentor suggestions
    return getRuleBasedResponseWithMentors(messageLower, mentors);
  } catch (error) {
    console.error("Error in getAiReply:", error);
    return getRuleBasedResponseWithMentors(messageLower, mentors);
  }
};

// AI-powered response generation
const getAIResponse = async (
  userMessage: string,
  intent?: IntentType,
  studentProfile?: StudentProfile,
  mentors?: MentorInfo[]
): Promise<string> => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const studentInfo = studentProfile
      ? `Сурагчийн мэдээлэл:\n${JSON.stringify(studentProfile, null, 2)}`
      : "Сурагчийн мэдээлэл: Хэрэглэгчийн мэдээл байхгүй байна";

    const mentorsInfo =
      mentors
        ?.map(
          (m) =>
            `- ${m.firstName || ""} ${m.lastName || ""}: ${m.bio} (Мэргэжил: ${
              m.profession
            }, Туршлага: ${m.experience?.careerDuration || ""}, Чиглэл: ${
              m.category?.categoryId || ""
            })`
        )
        .join("\n") || "Менторуудын мэдээл байхгүй байна";

    const prompt = `
${studentInfo}

Боломжит менторууд:
${mentorsInfo}

Сурагчийн асуулт:
"${userMessage}"

Intent: ${intent || "unknown"}

Чи Mentor Meet платформын AI туслах. Сурагчид хамгийн тохиромжтой ментор(ууд)-ыг сонгож, яагаад тохирохыг товч тайлбарла. Хэрэв сурагчийн мэдээл байхгүй бол ерөнхий зөвлөгөө өг. Хариултаа зөвхөн монголоор бич.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      response.choices[0].message.content || "AI хариу бэлдэхэд алдаа гарлаа."
    );
  } catch (error) {
    console.error("Error in getAIResponse:", error);
    throw error;
  }
};

// Rule-based response generation with mentor suggestions
const getRuleBasedResponseWithMentors = (
  messageLower: string,
  mentors?: MentorInfo[]
): string => {
  // Get relevant mentors based on message content
  const relevantMentors = getRelevantMentors(messageLower, mentors);

  // Python programming related
  if (messageLower.includes("python") || messageLower.includes("программ")) {
    const mentorSuggestions = formatMentorSuggestions(
      relevantMentors,
      "Python"
    );
    return `Python сурахад туслах ментор хэрэгтэй байна! Манай платформ дээр Python-д мэргэшсэн ширээтэн менторууд байна. Тэд танд Python програмчлалын үндэс, Django, Flask, data science зэргийг заахад бэлэн байна.${mentorSuggestions}`;
  }

  // General programming
  if (messageLower.includes("код") || messageLower.includes("технологи")) {
    const mentorSuggestions = formatMentorSuggestions(
      relevantMentors,
      "програмчлал"
    );
    return `Программчлалын талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд JavaScript, Python, React, Node.js зэрэг технологиудыг заахад бэлэн байна.${mentorSuggestions}`;
  }

  // Business related
  if (messageLower.includes("бизнес") || messageLower.includes("менеджмент")) {
    const mentorSuggestions = formatMentorSuggestions(
      relevantMentors,
      "бизнес"
    );
    return `Бизнес, менежментийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд бизнес стратеги, менежмент зэргийг заахад бэлэн байна.${mentorSuggestions}`;
  }

  // Design related
  if (messageLower.includes("дизайн") || messageLower.includes("график")) {
    const mentorSuggestions = formatMentorSuggestions(
      relevantMentors,
      "дизайн"
    );
    return `Дизайн, графикийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд UI/UX дизайн, график дизайн зэргийг заахад бэлэн байна.${mentorSuggestions}`;
  }

  // Health related
  if (messageLower.includes("эрүүл") || messageLower.includes("анагаах")) {
    const mentorSuggestions = formatMentorSuggestions(
      relevantMentors,
      "эрүүл мэнд"
    );
    return `Эрүүл мэндийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд эрүүл мэндийн зөвлөгөө өгөхөд бэлэн байна.${mentorSuggestions}`;
  }

  // Law related
  if (messageLower.includes("хууль") || messageLower.includes("эрх")) {
    const mentorSuggestions = formatMentorSuggestions(relevantMentors, "хууль");
    return `Хууль, эрх зүйн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд хууль, эрх зүйн асуудлуудыг тайлбарлахад бэлэн байна.${mentorSuggestions}`;
  }

  // Mentor request related
  if (messageLower.includes("санал") || messageLower.includes("болгооч")) {
    const mentorSuggestions = formatMentorSuggestions(
      relevantMentors,
      "ментор"
    );
    return `Ментор санал болгох хүсэлт байна! Манай платформ дээр ширээтэн менторууд байна. Та өөрийн сонирхсон чиглэл, мэргэжлийг дэлгэрэнгүй тайлбарлавал би танд тохиромжтой ментор(ууд)-ыг санал болгож болно.${mentorSuggestions}`;
  }

  // Audio/Media related
  if (
    messageLower.includes("sound") ||
    messageLower.includes("audio") ||
    messageLower.includes("engineer") ||
    messageLower.includes("дуу") ||
    messageLower.includes("хөгжүүлэлт")
  ) {
    const mentorSuggestions = formatMentorSuggestions(
      relevantMentors,
      "дуу хөгжүүлэлт"
    );
    return `Sound Engineer сурахад туслах ментор хэрэгтэй байна! Манай платформ дээр дуу хөгжүүлэлт, аудио инженерийн чиглэлээр мэргэшсэн ширээтэн менторууд байна. Тэд танд аудио технологи, дуу бичлэг, хөгжүүлэлт зэргийг заахад бэлэн байна.${mentorSuggestions}`;
  }

  // General response
  const mentorSuggestions = formatMentorSuggestions(relevantMentors, "ерөнхий");
  return `Сайн байна уу! Таны асуултад хариулахад баяртай байна. Манай платформ дээр ширээтэн менторууд байна. Тэд танд тусламж үзүүлэхэд бэлэн байна.${mentorSuggestions}`;
};

// Helper function to get relevant mentors based on message content
const getRelevantMentors = (
  messageLower: string,
  mentors?: MentorInfo[]
): MentorInfo[] => {
  if (!mentors || mentors.length === 0) return [];

  // Filter mentors based on message content
  const relevantMentors = mentors.filter((mentor) => {
    const mentorInfo = `${mentor.profession || ""} ${mentor.bio || ""} ${
      mentor.category?.categoryId || ""
    }`.toLowerCase();

    if (messageLower.includes("python") || messageLower.includes("программ")) {
      return (
        mentorInfo.includes("python") ||
        mentorInfo.includes("программ") ||
        mentorInfo.includes("developer")
      );
    }
    if (
      messageLower.includes("бизнес") ||
      messageLower.includes("менеджмент")
    ) {
      return (
        mentorInfo.includes("бизнес") ||
        mentorInfo.includes("менеджмент") ||
        mentorInfo.includes("business")
      );
    }
    if (messageLower.includes("дизайн") || messageLower.includes("график")) {
      return (
        mentorInfo.includes("дизайн") ||
        mentorInfo.includes("график") ||
        mentorInfo.includes("design")
      );
    }
    if (messageLower.includes("эрүүл") || messageLower.includes("анагаах")) {
      return (
        mentorInfo.includes("эрүүл") ||
        mentorInfo.includes("анагаах") ||
        mentorInfo.includes("health")
      );
    }
    if (messageLower.includes("хууль") || messageLower.includes("эрх")) {
      return (
        mentorInfo.includes("хууль") ||
        mentorInfo.includes("эрх") ||
        mentorInfo.includes("law")
      );
    }
    if (
      messageLower.includes("sound") ||
      messageLower.includes("audio") ||
      messageLower.includes("engineer") ||
      messageLower.includes("дуу")
    ) {
      return (
        mentorInfo.includes("sound") ||
        mentorInfo.includes("audio") ||
        mentorInfo.includes("engineer") ||
        mentorInfo.includes("дуу") ||
        mentorInfo.includes("хөгжүүлэлт") ||
        mentorInfo.includes("media")
      );
    }

    return true; // Return all mentors for general requests
  });

  return relevantMentors.slice(0, 3); // Return top 3 relevant mentors
};

// Helper function to format mentor suggestions
const formatMentorSuggestions = (
  mentors: MentorInfo[],
  category: string
): string => {
  if (mentors.length === 0) {
    return " Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  const mentorList = mentors
    .map((mentor) => {
      const name = `${mentor.firstName || ""} ${mentor.lastName || ""}`.trim();
      const profession = mentor.profession || "Ментор";
      const experience = mentor.experience?.careerDuration || "";
      return `• ${name} (${profession}${
        experience ? `, ${experience} жил туршлагатай` : ""
      })`;
    })
    .join("\n");

  return `\n\n${
    category.charAt(0).toUpperCase() + category.slice(1)
  }-д мэргэшсэн менторууд:\n${mentorList}\n\nЭдгээр менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.`;
};

// Original rule-based response generation (for backward compatibility)
const getRuleBasedResponse = (messageLower: string): string => {
  // Python programming related
  if (messageLower.includes("python") || messageLower.includes("программ")) {
    return "Python сурахад туслах ментор хэрэгтэй байна! Манай платформ дээр Python-д мэргэшсэн ширээтэн менторууд байна. Тэд танд Python програмчлалын үндэс, Django, Flask, data science зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // General programming
  if (messageLower.includes("код") || messageLower.includes("технологи")) {
    return "Программчлалын талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд JavaScript, Python, React, Node.js зэрэг технологиудыг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Business related
  if (messageLower.includes("бизнес") || messageLower.includes("менеджмент")) {
    return "Бизнес, менежментийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд бизнес стратеги, менежмент зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Design related
  if (messageLower.includes("дизайн") || messageLower.includes("график")) {
    return "Дизайн, графикийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд UI/UX дизайн, график дизайн зэргийг заахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Health related
  if (messageLower.includes("эрүүл") || messageLower.includes("анагаах")) {
    return "Эрүүл мэндийн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд эрүүл мэндийн зөвлөгөө өгөхөд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Law related
  if (messageLower.includes("хууль") || messageLower.includes("эрх")) {
    return "Хууль, эрх зүйн талаар асуулт байна! Манай платформ дээр ширээтэн менторууд байна. Тэд танд хууль, эрх зүйн асуудлуудыг тайлбарлахад бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй.";
  }

  // Mentor request related
  if (messageLower.includes("санал") || messageLower.includes("болгооч")) {
    return "Ментор санал болгох хүсэлт байна! Манай платформ дээр ширээтэн менторууд байна. Та өөрийн сонирхсон чиглэл, мэргэжлийг дэлгэрэнгүй тайлбарлавал би танд тохиромжтой ментор(ууд)-ыг санал болгож болно. Жишээ нь: програмчлал, бизнес, дизайн, эрүүл мэнд гэх мэт.";
  }

  // General response
  return "Сайн байна уу! Таны асуултад хариулахад баяртай байна. Манай платформ дээр ширээтэн менторууд байна. Тэд танд тусламж үзүүлэхэд бэлэн байна. Менторуудтай холбогдохын тулд тэдний профайлыг үзээрэй. Мөн та өөрийн асуултаа дэлгэрэнгүй тайлбарлавал би танд тохиромжтой ментор(ууд)-ыг санал болгож болно.";
};

// Simple response for testing
export const getSimpleResponse = (message: string): string => {
  return getRuleBasedResponse(message.toLowerCase());
};
