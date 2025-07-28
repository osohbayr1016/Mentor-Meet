import { Request, Response } from "express";
import { StudentModel, TempUserModel } from "../model/student-model";
import nodemailer from "nodemailer";
import { OtpModel } from "../model/Otp-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const Hello = async (_req: Request, res: Response) => {
  res.send({ message: "hello" });
};

export const Checkemail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await StudentModel.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User already existed" });
      return 
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
      html:`
      <p>Сайн байна уу! Та өөрийн имайл хаягыг баталгаажуулж дараах (OTP) кодыг оруулна уу?:</p>
     <div style="font-size: 32px; font-weight: bold; color: black; margin: 20px 0; letter-spacing: 5px;">
  ${code}
</div>
`
    };

    await OtpModel.create({ email,code });

    await transport.sendMail(options);

    return res.status(200).json({ message: "Email OK" });
  } catch (error) {
    console.error("Checkemail error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkOtp = async (req: Request, res: Response) => {
  const { email,code } = req.body;

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
 return 
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

    
       tempUser.password = hashedPassword;
    await tempUser.save()

    res.send({ message: "Successfully updated password" });
    return 
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const StudentNameNumber = async (req: Request, res: Response) => {
  const { email, nickname, phoneNumber} = req.body;

  try {
     const tempUser = await TempUserModel.findOne({ email, isVerified: true, password: { $exists: true } });

    if (!tempUser) {
      return res.status(400).json({ message: "Email not verified or password not set" });
    }

    tempUser.nickname = nickname;
    tempUser.phoneNumber = phoneNumber;


       await tempUser.save();


    const existingStudent = await StudentModel.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "User already exists in main collection" });
    }


      const student = await StudentModel.create({
      email: tempUser.email,
      password: tempUser.password,
      nickname: tempUser.nickname,
      phoneNumber: tempUser.phoneNumber,
    });


      await TempUserModel.deleteOne({ email });

     if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");
    const token = jwt.sign({ userId: student._id }, process.env.JWT_SECRET);


    return res.status(200).json({ message: "Successfully updated name and number", tempUser,token });
  } catch (error) {
    console.error("StudentNameNumber error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};