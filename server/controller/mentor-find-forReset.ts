import { MentorModel } from "../model/mentor-model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OtpModel } from "../model/Otp-model";
import nodemailer from "nodemailer";

export const findmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // if (!email) {
    //   return res.status(400).send({ message: "Имайл шаардлагатай!" });
    // }

    const user = await MentorModel.findOne({ email });
    if (user) {
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
    }
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Checkemail error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
