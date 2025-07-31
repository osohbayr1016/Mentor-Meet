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
    console.log("MentorCheckemail request body:", { email });

    // Validate email
    if (!email) {
      console.log("Validation failed: email is missing");
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Validation failed: invalid email format");
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    console.log("Checking if user already exists...");
    const user = await MentorModel.findOne({ email });

    if (user) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Generating OTP code...");
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("OTP code generated:", code);

    console.log("Setting up email transport...");
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

    console.log("Creating OTP record in database...");
    await OtpModel.create({ code, email });
    console.log("OTP record created successfully");

    console.log("Sending email...");
    await transport.sendMail(options);
    console.log("Email sent successfully");

    return res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error: any) {
    console.error("Checkemail error details:", {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      name: error?.name || 'Error'
    });
    return res.status(500).json({
      message: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
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
    console.log("MentorSignUp request body:", { email, password: password ? "***" : "undefined" });

    // Validate required fields
    if (!email || !password) {
      console.log("Validation failed: missing email or password");
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Validation failed: invalid email format");
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log("Validation failed: password too short");
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    console.log("Starting password hashing...");
    const hashedPassword = await bcrypt.hashSync(password, 10);
    console.log("Password hashed successfully");

    console.log("Loading environment variables...");
    dotenv.config();
    const tokenPassword = process.env.JWT_SECRET;
    if (!tokenPassword) {
      console.error("JWT_SECRET not found in environment variables");
      throw new Error("JWT_SECRET not defined");
    }
    console.log("JWT_SECRET loaded successfully");

    console.log("Checking if user already exists...");
    const FindUser: any = await MentorModel.findOne({ email });

    if (FindUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Creating new user...");
    const user = await MentorModel.create({
      email,
      password: hashedPassword,
    });
    console.log("User created successfully:", user._id);

    console.log("Generating JWT token...");
    const token = jwt.sign(
      {
        mentorId: user._id,
        isMentor: true,
        email: user.email,
      },
      tokenPassword
    );
    console.log("JWT token generated successfully");

    console.log("Sending success response...");
    return res.status(200).json({
      message: "Амжилттай бүртгэгдлээ.",
      token,
      mentorId: user._id.toString()
    });
  } catch (err: any) {
    console.error("MentorSignUp error details:", {
      message: err?.message || 'Unknown error',
      stack: err?.stack,
      name: err?.name || 'Error'
    });
    return res.status(500).json({
      message: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err?.message : undefined
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
