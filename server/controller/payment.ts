import { Request, Response } from "express";
import mongoose from "mongoose";
import { PaymentModel } from "../model/payment-model";
import { StudentModel } from "../model/student-model";
import nodemailer from "nodemailer";
import { MentorModel } from "../model/mentor-model";
import { EmailModel } from "../model/email-model";

export const Payment = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { calendarId, email, mentorId, price, paymentStatus } = req.body;

  if (!studentId) {
    return res.status(401).send({ message: "Та нэвтэрнэ үү" });
  }

  try {
    const existingPayment = await PaymentModel.findOne({
      studentId,
      calendarId,
    });

    if (existingPayment) {
      return res
        .status(400)
        .send({ message: "Та энэ цагийг аль хэдийн захиалсан байна." });
    }

    const newPayment = await PaymentModel.create({
      studentId,
      mentorId,
      calendarId,
      price,
      paymentStatus,
      email,
    });

    res
      .status(201)
      .send({ message: "Төлбөр амжилттай бүртгэгдлээ", data: newPayment });

    if (paymentStatus === "succeeded") {
      const user = await StudentModel.findOne({ email });

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
    }

    const mail = "Төлбөр амжилттай төлөгдлөө";

    await StudentModel.create({ email });

    const options = {
      from: "jochuekimmich@gmail.com",
      to: email,
      subject: "Төлбөр баталгаажуулалтын мэдээ",
      html: `
          <p>Сайн байна уу!${mail}</p>
         <div style="font-size: 32px; font-weight: bold; color: black; margin: 20px 0; letter-spacing: 5px;">
      ${mail}
    </div>
    `,
    };

    await EmailModel.create({ mail });

    // await transport.sendMail(options);

    return res.status(200).json({ message: "Email OK" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Серверийн алдаа" });
  }
};
