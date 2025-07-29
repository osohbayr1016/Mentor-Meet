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
    // if (!email) {
    //   return res.status(400).send({ message: "Имайл шаардлагатай!" });
    // }

    const user = await MentorModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already existed" });
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
      subject: "Hello",
      html: `<div style="color:red"> ${code}</div> `,
    };

    await OtpModel.create({ code, email });

    await transport.sendMail(options);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Checkemail error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkOtp = async (req: Request, res: Response) => {
  const { code, email } = req.body;

  try {
    const isOtpExisting = await OtpModel.findOne({
      code: code,
    });
    if (!isOtpExisting) {
      res.status(400).send("wrong code isOtp");
      return;
    }
    if (isOtpExisting.email === email) {
      return res.status(200).send({ message: "success" });
    } else {
      return res.status(400).send({ message: "Wrong code err" });
    }
  } catch (err) {
    res.status(400).send("Wrong code catch");
  }
};

export const MentorSignUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hashSync(password, 10);

    dotenv.config();
    const tokenPassword = process.env.JWT_SECRET;
    if (!tokenPassword) {
      throw new Error("JWT_Password not defined");
    }
    const FindUser: any = await MentorModel.findOne({ email });

    if (FindUser) {
      res.status(400).send({ message: "Already exist" });
      return;
    }

    const user = await MentorModel.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        mentorId: user._id,
        isAdmin: user.role === "ADMIN" ? true : false,
      },
      tokenPassword
    );

    res.send({ message: "Амжилттай бүртгэгдлээ.", token });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
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
