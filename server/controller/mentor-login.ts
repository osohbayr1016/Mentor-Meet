import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MentorModel } from "../model/mentor-model";
import { config } from "dotenv";

config();

export const MentorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password, googleAuth } = req.body;

    if (!email) {
      return res
        .status(400)
        .send({ message: "Имайл шаардлагатай!" });
    }

    // For traditional login, password is required
    if (!googleAuth && !password) {
      return res
        .status(400)
        .send({ message: "Нууц үг шаардлагатай!" });
    }

    const mentor = await MentorModel.findOne({ email });
    if (!mentor) {
      return res.status(401).send({ message: "Имайл буруу байна!" });
    }

    // For Google OAuth users, skip password validation
    if (!googleAuth) {
      if (!mentor.password) {
        return res.status(401).send({ message: "Энэ хэрэглэгч Google-р бүртгэгдсэн байна!" });
      }

      const isPasswordValid = await bcrypt.compare(password, mentor.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Нууц үг буруу байна!" });
      }
    } else {
      // For Google OAuth users, verify they have googleAuth enabled
      if (!mentor.googleAuth) {
        return res.status(401).send({ message: "Энэ хэрэглэгч Google-р бүртгэгдээгүй байна!" });
      }
    }

    const secret = process.env.JWT_SECRET;
    console.log(secret, "login secter");

    if (!secret)
      return res.status(500).send({ message: "JWT тохиргоо алга байна!" });

    const token = jwt.sign(
      { mentorId: mentor._id.toString(), isMentor: mentor.role === "MENTOR" },
      secret,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Амжилттай нэвтэрлээ",
      token,
      mentorId: mentor._id,
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ message: "Серверийн алдаа!", error: error.message });
  }
};



