

import { Request, Response } from "express";
import { PaymentModel } from "../model/payment-model";
import { StudentModel } from "../model/student-model";
import { MentorModel } from "../model/mentor-model";
import { EmailModel } from "../model/email-model";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "baabarmx@gmail.com",
    pass: "yignruoqpvxgluyq",
  },
});

export const Payment = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { calendarId, email, mentorId, price, paymentStatus } = req.body;

  if (!studentId) {
    return res.status(401).send({ message: "Та нэвтэрнэ үү" });
  }

  try {
    const existingPayment = await PaymentModel.findOne({ studentId, calendarId });

    if (existingPayment) {
      return res.status(400).send({
        message: "Та энэ цагийг аль хэдийн захиалсан байна.",
      });
    }

    const newPayment = await PaymentModel.create({
      studentId,
      mentorId,
      calendarId,
      price,
      paymentStatus,
      email,
    });

    if (paymentStatus === "pending") {
      const student = await StudentModel.findOne({ email });
      const mentor = await MentorModel.findOne({ _id: mentorId });

      const studentMessage = "Таны төлбөр амжилттай баталгаажлаа.";
      const mentorMessage = `Таны цагийг оюутан амжилттай захиалж, төлбөр төлсөн.`;

      if (student) {
        await transporter.sendMail({
          from: "baabarmx@gmail.com",
          to: email,
          subject: "Төлбөр амжилттай төлөгдлөө",
          html: `
            <p>Сайн байна уу!</p>
            <div style="font-size: 20px; font-weight: bold; color: black; margin: 20px 0;">${studentMessage}</div>
          `,
        });

        await EmailModel.create({ email, mail: studentMessage });
      }

      // Менторт и-мэйл илгээх
      if (mentor) {
        await transporter.sendMail({
          from: "baabarmx@gmail.com",
          to: mentor.email,
          subject: "Шинэ төлбөрийн мэдээлэл",
          html: `
            <p>Сайн байна уу, ${mentor.firstName}!</p>
            <div style="font-size: 20px; font-weight: bold; color: black; margin: 20px 0;">${mentorMessage}</div>
          `,
        });

        await EmailModel.create({ email: mentor.email, mail: mentorMessage });
      }
    }

    return res.status(201).json({
      message: "Төлбөр амжилттай бүртгэгдлээ",
      data: newPayment,
    });
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    return res.status(500).send({ message: "Серверийн алдаа" });
  }
};
