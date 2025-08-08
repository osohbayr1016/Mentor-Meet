import { Request, Response } from "express";
import { StudentModel, TempUserModel } from "../model/student-model";
import nodemailer from "nodemailer";
import { OtpModel } from "../model/Otp-model";
import bcrypt from "bcrypt";
import { createStudentToken } from "../utils/jwt-utils";

export const Checkemail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await StudentModel.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User already existed" });
      return;
    }

    const tempUserExists = await TempUserModel.findOne({ email });
    if (tempUserExists) {
      await TempUserModel.deleteOne({ email });
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "jochuekimmich@gmail.com",
        pass: "xcyqnkwxrykxstna",
      },
    });

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    await TempUserModel.create({ email, code });

    const options = {
      from: "jochuekimmich@gmail.com",
      to: email,
      subject: "Баталгаажуулах код",
      html: `
      <p>Сайн байна уу! Та өөрийн имайл хаягыг баталгаажуулж дараах (OTP) кодыг оруулна уу?:</p>
     <div style="font-size: 32px; font-weight: bold; color: black; margin: 20px 0; letter-spacing: 5px;">
  ${code}
</div>
`,
    };

    await OtpModel.create({ email, code });

    await transport.sendMail(options);

    return res.status(200).json({ message: "Email OK" });
  } catch (error) {
    console.error("Checkemail error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkOtp = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const isOtpExisting = await OtpModel.findOne({
      code: code,
    });
    if (!isOtpExisting) {
      res.status(400).send("wrong code");
      return;
    }

    const tempUser = await TempUserModel.findOne({ email, code });

    if (!tempUser) {
      res.status(400).json({ message: "Wrong OTP code" });
      return;
    }

    tempUser.isVerified = true;
    await tempUser.save();

    res.status(200).send({ message: "success", isOtpExisting });
  } catch (err) {
    res.status(400).send("Wrong code");
  }
};

export const createPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const tempUser = await TempUserModel.findOne({ email, isVerified: true });

    if (!tempUser) {
      return res.status(400).json({ message: "Email not verified or invalid" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Persist hashed password on temp user for traceability (optional)
    tempUser.password = hashedPassword;
    await tempUser.save();

    // Create or update a real Student record immediately and issue token
    let student = await StudentModel.findOne({ email });
    if (!student) {
      student = await StudentModel.create({
        email,
        password: hashedPassword,
      });
    } else {
      // Update password if student already exists
      student.password = hashedPassword;
      await student.save();
    }

    // Remove temp user record (no longer needed)
    await TempUserModel.deleteOne({ email });

    const token = createStudentToken(student._id, student.email);

    return res.status(200).json({
      message: "Successfully set password and created account",
      user: {
        _id: student._id,
        email: student.email,
        nickname: student.nickname,
        phoneNumber: student.phoneNumber,
      },
      token,
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const StudentNameNumber = async (req: Request, res: Response) => {
  const { email, nickname, phoneNumber, googleAuth, googleData } = req.body;

  try {
    // For Google OAuth users, skip temp user verification
    if (googleAuth) {
      // Check if student already exists
      const existingStudent = await StudentModel.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create student directly with Google data
      const student = await StudentModel.create({
        email,
        nickname,
        phoneNumber,
        googleAuth: true,
        // No password for Google OAuth users
      });

      const token = createStudentToken(student._id, student.email);

      return res.status(200).json({
        message: "Successfully created student with Google OAuth",
        user: {
          _id: student._id,
          email: student.email,
          nickname: student.nickname,
          phoneNumber: student.phoneNumber,
        },
        token,
      });
    }

    // Traditional signup flow: student record should already exist after createPassword
    let student = await StudentModel.findOne({ email });

    if (!student) {
      // Fallback: if, for some reason, student doesn't exist yet, create one now
      const tempUser = await TempUserModel.findOne({ email, isVerified: true });
      if (!tempUser) {
        return res
          .status(400)
          .json({ message: "Email not verified or password not set" });
      }

      student = await StudentModel.create({
        email: tempUser.email,
        password: tempUser.password,
      });
      await TempUserModel.deleteOne({ email });
    }

    // Update profile fields
    if (typeof nickname !== "undefined") student.nickname = nickname;
    if (typeof phoneNumber !== "undefined") student.phoneNumber = phoneNumber;
    await student.save();

    const token = createStudentToken(student._id, student.email);

    return res.status(200).json({
      message: "Successfully updated name and number",
      user: {
        _id: student._id,
        email: student.email,
        nickname: student.nickname,
        phoneNumber: student.phoneNumber,
      },
      token,
    });
  } catch (error) {
    console.error("StudentNameNumber error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
