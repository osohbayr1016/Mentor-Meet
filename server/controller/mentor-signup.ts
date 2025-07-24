import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";
import bcrypt from "bcrypt";
export const MentorSignUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (
    !email ||
    !password ||
    typeof email != "string" ||
    typeof password !== "string"
  ) {
    res.status(400).send({ message: "Имайл, нууц үг шаардлагатай." });
    return;
  }

  const isEmailExisted = await MentorModel.findOne({ email });
  if (!isEmailExisted) {
    const hashedPassword = await bcrypt.hashSync(password, 10);
    await MentorModel.create({ email, password: hashedPassword });
    res.status(200).send({ message: "Бүртгэл амжилттай" });
  }
};
