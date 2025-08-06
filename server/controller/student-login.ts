import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MentorModel } from "../model/mentor-model";
import { config } from "dotenv";
import { StudentModel } from "../model/student-model";

export const StudentLogin = async (req: Request, res: Response) => {
  try {
    const { email, password, googleAuth } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Имайл шаардлагатай!" });
    }

    // For traditional login, password is required
    if (!googleAuth && !password) {
      return res.status(400).send({ message: "Нууц үг шаардлагатай!" });
    }

    const student = await StudentModel.findOne({ email });

    if (!student) {
      return res.status(400).send({ message: "Имайл буруу байна!" });
    }

    // For Google OAuth users, skip password validation
    if (!googleAuth) {
      if (!student.password) {
        return res
          .status(401)
          .send({ message: "Энэ хэрэглэгч Google-р бүртгэгдсэн байна!" });
      }

      const isPasswordValid = await bcrypt.compare(password, student.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Нууц үг буруу байна!" });
      }
    } else {
      // For Google OAuth users, verify they have googleAuth enabled
      if (!student.googleAuth) {
        return res
          .status(401)
          .send({ message: "Энэ хэрэглэгч Google-р бүртгэгдээгүй байна!" });
      }
    }

    const token = jwt.sign(
      { studentId: student.id, email: student.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      token,
      user: {
        id: student.id,
        email: student.email,
        nickname: student.nickname,
        phoneNumber: student.phoneNumber,
      },
    });
  } catch (error: any) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: "Серверийн алдаа!", error: error.message });
    return;
  }
};
