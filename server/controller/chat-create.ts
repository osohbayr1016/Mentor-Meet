import { Request, Response } from "express";
import { MessageModel } from "../model/chat-model";
import { StudentModel } from "../model/student-model";
import { MentorModel } from "../model/mentor-model";
import {
  detectIntent,
  getAiReply,
  type IntentType,
  type StudentProfile,
  type MentorInfo,
} from "../utils";

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
    const { email, message, studentProfile, requestType = "chat" } = req.body;

    if (!email || !message) {
      return res
        .status(400)
        .json({ error: "Email болон message шаардлагатай!" });
    }

    // Intent detection
    const intent = await detectIntent(message);

    // Student profile-г олж авна эсвэл үүсгэнэ
    let finalStudentProfile = studentProfile;

    if (!studentProfile) {
      // MongoDB-оос student profile-г хайж олно
      const existingStudent = await StudentModel.findOne({ email });
      if (existingStudent) {
        finalStudentProfile = {
          name:
            (existingStudent as any).firstName +
            " " +
            (existingStudent as any).lastName,
          email: existingStudent.email,
          phoneNumber: (existingStudent as any).phoneNumber || "",
        };
      } else {
        // Хэрэв student profile байхгүй бол null болгоно
        finalStudentProfile = null;
      }
    }

    const mentor = await MentorModel.findOne({ email });

    let senderType = "";
    if (finalStudentProfile) senderType = "student";
    else if (mentor) senderType = "mentor";
    else senderType = "unknown";

    const userMsg = await MessageModel.create({
      email,
      message,
      senderType,
      intent,
    });

    let aiReply = "";
    let mentors: any[] = [];

    // Request type-аас хамааран өөр өөр хариу өгнө
    if (
      requestType === "mentor-suggestion" ||
      intent === "хүсэлт" ||
      intent === "тусламж"
    ) {
      // Mentor санал болгох
      try {
        // MongoDB-оос mentor-уудыг авах
        mentors = await MentorModel.find({});
        console.log(`Found ${mentors.length} mentors from database`);

        // Use the new getAiReply utility function
        aiReply = await getAiReply(
          message,
          intent,
          finalStudentProfile,
          mentors
        );
      } catch (err) {
        console.error("Mentor suggestion error:", err);
        aiReply = "Ментор санал болгоход алдаа гарлаа.";
      }
    } else {
      // Ердийн чат хариу - энгийн fallback хариу
      // Mentor-уудыг эхлээд авах
      if (mentors.length === 0) {
        mentors = await MentorModel.find({}).limit(5);
        console.log(`Found ${mentors.length} mentors for general chat`);
      }
      aiReply = await getAiReply(message, intent, finalStudentProfile, mentors);
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
        ...(mentors.length > 0 && { mentors: mentors.slice(0, 5) }),
      });
    }

    const botMsg = await MessageModel.create({
      email: "bot@mentormeet.mn",
      message: aiReply,
      senderType: "bot",
      intent: "other",
    });

    res.status(201).json({
      messages: [userMsg, botMsg],
      ...(mentors.length > 0 && { mentors: mentors.slice(0, 5) }),
    });
  } catch (err) {
    console.error("createMessage error:", err);
    res.status(500).json({ error: "Мессеж хадгалах үед алдаа гарлаа" });
  }
};
