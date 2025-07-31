import { MentorModel } from "../model/mentor-model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OtpModel } from "../model/Otp-model";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const MentorCheckemail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const user = await MentorModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "baabarmx@gmail.com",
        pass: "yignruoqpvxgluyq",
      },
    });

    const options = {
      from: "baabarmx@gmail.com",
      to: email,
      subject: "Mentor Meet - Email Verification",
      html: `<div style="color:red">Your verification code is: ${code}</div>`,
    };

    await OtpModel.create({ code, email });

    await transport.sendMail(options);

    return res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Checkemail error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkOtp = async (req: Request, res: Response) => {
  const { code, email } = req.body;

  try {
    // Validate required fields
    if (!code || !email) {
      return res.status(400).json({ message: "Code and email are required" });
    }

    const isOtpExisting = await OtpModel.findOne({
      code: code,
      email: email,
    });
    
    if (!isOtpExisting) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Check if OTP is expired (optional: add expiration logic)
    // const now = new Date();
    // const otpCreated = new Date(isOtpExisting.createdAt);
    // const diffInMinutes = (now.getTime() - otpCreated.getTime()) / (1000 * 60);
    // if (diffInMinutes > 10) { // 10 minutes expiration
    //   return res.status(400).json({ message: "Verification code has expired" });
    // }

    return res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    console.error("OTP check error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const MentorSignUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    dotenv.config();
    const tokenPassword = process.env.JWT_SECRET;
    if (!tokenPassword) {
      throw new Error("JWT_Password not defined");
    }

    const FindUser: any = await MentorModel.findOne({ email });

    if (FindUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await MentorModel.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        mentorId: user._id,
        isMentor: true,
        email: user.email,
      },
      tokenPassword
    );

    return res.status(200).json({
      message: "Амжилттай бүртгэгдлээ.",
      token,
      mentorId: user._id.toString()
    });
  } catch (err) {
    console.error("MentorSignUp error:", err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// export const MentorSignUp = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     if (
//       !email ||
//       !password ||
//       typeof email != "string" ||
//       typeof password !== "string"
//     ) {
//       res.status(400).send({ message: "Имайл, нууц үг шаардлагатай!" });
//       return;
//     }

//     const isEmailExisted = await MentorModel.findOne({ email });
//     if (!isEmailExisted) {
//       const hashedPassword = await bcrypt.hashSync(password, 10);
//       await MentorModel.create({ email, password: hashedPassword });
//       res.send({ message: "Амжилттай бүртгэгдлээ." });
//       return;
//     }
//     res.send({ message: "Хэрэглэгч бүртгэлтэй байна!" });
//   } catch (err) {
//     console.error({ message: "Бүртгэлд алдаа гарлаа" });
//     return res.status(500).send({ message: "Серверт алдаа гарлаа" });
//   }
// };
