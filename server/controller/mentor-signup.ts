import { MentorType } from "../model/mentor-model";
import { Request, Response } from "express";

export const MentorSignUp = async (req: Request, res: Response) => {
  const { email, password, phoneNumber } = req.body;
  if (!email || !password || !phoneNumber || typeof email != "string" || typeof password !=="string" || typeof phoneNumber !== "number") {
    res
      .status(400)
      .send({ message: "Имайл, нууц үг, утасны дугаар шаардлагатай."});
    return;
  }

  const isEmailExisted = 
};
