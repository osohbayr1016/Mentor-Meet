import { MentorModel } from "../model/mentor-model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OtpModel } from "../model/Otp-model";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createMentorToken } from "../utils/jwt-utils";

export const MentorCheckemail = async (req: Request, res: Response) => {
  const { email, googleAuth } = req.body;

  try {
    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const user = await MentorModel.findOne({ email });

    if (user) {
      // For Google OAuth, return different response to indicate existing user
      if (googleAuth) {
        return res.status(200).json({
          error: false,
          message: "User already exists",
          userExists: true,
          canLoginWithGoogle: !!user.googleAuth
        });
      }

      return res.status(200).json({
        error: false,
        message: "User already exists",
        userExists: true
      });
    }

    // For Google OAuth, don't send OTP - email is available
    if (googleAuth) {
      return res.status(200).json({
        error: true, // true means email is available for signup
        message: "Email available for Google signup",
        userExists: false
      });
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

    return res
      .status(200)
      .json({
        error: true, // true means proceed to next step
        message: "Verification code sent successfully"
      });
  } catch (error: any) {
    console.error("Checkemail error details:", {
      message: error?.message || "Unknown error",
      stack: error?.stack,
      name: error?.name || "Error",
    });
    return res.status(500).json({
      message: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error?.message : undefined,
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
  const { email, password, googleAuth, googleData } = req.body;

  try {
    // Validate required fields
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // For Google OAuth users, password is optional
    if (!googleAuth && !password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Validate password length for non-Google auth users
    if (!googleAuth && password && password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    dotenv.config();
    const tokenPassword = process.env.JWT_SECRET;
    if (!tokenPassword) {
      throw new Error("JWT_SECRET not defined");
    }

    const FindUser: any = await MentorModel.findOne({ email });

    if (FindUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Prepare user data
    const userData: any = {
      email,
    };

    // Handle password for traditional signup
    if (!googleAuth && password) {
      const hashedPassword = await bcrypt.hashSync(password, 10);
      userData.password = hashedPassword;
    }

    // Handle Google OAuth data
    if (googleAuth && googleData) {
      if (googleData.name) {
        const nameParts = googleData.name.split(" ");
        userData.firstName = nameParts[0] || "";
        userData.lastName = nameParts.slice(1).join(" ") || "";
      }
      if (googleData.image) {
        userData.image = googleData.image;
      }
      // For Google OAuth users, we don't set a password
      userData.googleAuth = true;
    }

    const user = await MentorModel.create(userData);

    const token = createMentorToken(user._id, user.email, true);
    return res.status(200).json({
      message: "Амжилттай бүртгэгдлээ.",
      token,
      mentorId: user._id.toString(),
    });
  } catch (err: any) {
    console.error("MentorSignUp error details:", {
      message: err?.message || "Unknown error",
      stack: err?.stack,
      name: err?.name || "Error",
    });
    return res.status(500).json({
      message: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? err?.message : undefined,
    });
  }
};
