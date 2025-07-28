import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";
import bcrypt from "bcrypt";

export const mentorForgetPass = async (
  request: Request,
  response: Response
): Promise<any> => {
  const { email, password } = request.body;
  const isEmailExisted = await MentorModel.findOne({ email });
  try {
    if (!isEmailExisted) {
      response.status(401).send({ message: "User not found" });
      return;
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await MentorModel.updateOne({ email }, { password: hashedPassword });
      response.status(200).send("Success");
      return;
    }
  } catch (err) {
    response.status(401).send("ajillahgvi bn");
  }
};
