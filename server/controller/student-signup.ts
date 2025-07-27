import { Request, Response } from "express";
import { StudentModel } from "../model/student-model";
import nodemailer from "nodemailer";
import { OtpModel } from "../model/Otp-model";
import bcrypt from "bcrypt";

export const Hello = async (req: Request, res: Response) => {
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
      return res.status(400).json({ message: "User already existed" });
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

    const options = {
      from: "jochuekimmich@gmail.com",
      to: email,
      subject: "Баталгаажуулах код",
      text:`
      <p>Сайн байна уу! Та өөрийн имайл хаягыг баталгаажуулж дараах (OTP) кодыг оруулна уу?:</p>
     <div style="font-size: 32px; font-weight: bold; color: black; margin: 20px 0; letter-spacing: 5px;">
  ${code}
</div>
`
    };

    await OtpModel.create({ code });

    await transport.sendMail(options);

    return res.status(200).json({ message: "Email OK" });
  } catch (error) {
    console.error("Checkemail error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkOtp = async (req: Request, res: Response) => {
  const { code } = req.body;

  try {
    const isOtpExisting = await OtpModel.findOne({
      code: code,
    });
    if (!isOtpExisting) {
      res.status(400).send("wrong code");
      return;
    }

    res.status(200).send({ message: "success", isOtpExisting });
  } catch (err) {
    res.status(400).send("Wrong code");
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const isEmailExisted = await StudentModel.findOne({ email });

  if (!isEmailExisted) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  const hashedPassword = await bcrypt.hashSync(password, 10);

  await StudentModel.create({ email }, { password: hashedPassword });

  res.send({ message: "Successfully updated password" });
};

export const StudentNameNumber = async (req: Request, res: Response) => {
  const { email } = req.body;
  const isEmailExisted = await StudentModel.findOne({ email });
  if (!isEmailExisted) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  const nickname = await StudentModel.create({
    nickname: req.body.nickname,
    phoneNumber: req.body.phoneNumber,
  });

  return res.status(201).json(nickname);
};
