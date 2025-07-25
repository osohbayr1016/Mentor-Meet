
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MentorModel } from "../model/mentor-model";
import { config } from "dotenv";

config(); 

export const MentorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Имайл болон нууц үг шаардлагатай!" });
    }

    const user = await MentorModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Имайл буруу байна!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Нууц үг буруу байна!" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).send({ message: "JWT тохиргоо алга байна!" });

    const token = jwt.sign(
      { mentorId: user._id, isMentor: user.role === "MENTOR"},
    
      secret,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Амжилттай нэвтэрлээ",
      token,
      mentorId: user._id,
    });

  } catch (error: any) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Серверийн алдаа!", error: error.message });
  }
};
