import { MentorType } from "../model/mentor-model";
import expess from "express";

export const MentorSignUp = async (req: Request, res: Response) => {
  const { email, password, phoneNumber } = req.body;
  if (!email || !password || !phoneNumber) {
  }
};
