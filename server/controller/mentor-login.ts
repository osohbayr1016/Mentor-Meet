import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { MentorModel } from "../model/mentor-model";
import { config } from "dotenv";
import { createMentorToken } from "../utils/jwt-utils";

config();

export const MentorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password, googleAuth } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Имайл шаардлагатай!" });
    }

    // For traditional login, password is required
    if (!googleAuth && !password) {
      return res.status(400).send({ message: "Нууц үг шаардлагатай!" });
    }

    const mentor = await MentorModel.findOne({ email });
    if (!mentor) {
      return res.status(401).send({ message: "Имайл буруу байна!" });
    }

    // For Google OAuth users, skip password validation
    if (!googleAuth) {
      if (!mentor.password) {
        return res
          .status(401)
          .send({ message: "Энэ хэрэглэгч Google-р бүртгэгдсэн байна!" });
      }

      const isPasswordValid = await bcrypt.compare(password, mentor.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Нууц үг буруу байна!" });
      }
    } else {
      // For Google OAuth users, verify they have googleAuth enabled
      console.log("Google OAuth login attempt for mentor:", {
        email: mentor.email,
        hasGoogleAuth: !!mentor.googleAuth,
        googleAuthValue: mentor.googleAuth
      });

      if (!mentor.googleAuth) {
        console.log("Mentor does not have googleAuth enabled, updating mentor record");
        // If mentor exists but doesn't have googleAuth enabled, enable it for them
        await MentorModel.findByIdAndUpdate(mentor._id, { googleAuth: true });
        console.log("Updated mentor googleAuth to true");
      }
    }

    const secret = process.env.JWT_SECRET;

    if (!secret)
      return res.status(500).send({ message: "JWT тохиргоо алга байна!" });

    const token = createMentorToken(mentor._id, mentor.email);

    return res.status(200).json({
      message: "Амжилттай нэвтэрлээ",
      token,
      mentorId: mentor._id,
      mentor: {
        mentorId: mentor._id,
        email: mentor.email,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        image: mentor.image,
        isAdmin: false,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ message: "Серверийн алдаа!", error: error.message });
  }
};
