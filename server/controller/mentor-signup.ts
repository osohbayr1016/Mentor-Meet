import { MentorType } from "../model/mentor-model";
import { Request, Response } from "express";

export const MentorSignUp = async (req: Request, res: Response) => {
  const { email, password, phoneNumber } = req.body;
  if (
    !email ||
    !password ||
    !phoneNumber ||
    typeof email != "string" ||
    typeof password !== "string"
  ) {
    res.status(400).send({ message: "Имайл, нууц үг шаардлагатай." });
    return;
  }

  const isEmailExisted = await MentorModel.findOne({ email });
  if (!isEmailExisted) {
    const hashedPassword = await bcrypt.hashsync(password, 10);
    await MentorModel.create({ email, password: hashedPassword });
    res.status(200).send({ message: "Бүртгэл амжилттай" });
  }
};
