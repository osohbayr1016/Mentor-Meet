import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { StudentModel } from "../model/student-model";

export const studentForgetPass = async (
  request: Request,
  response: Response
): Promise<any> => {
  const { email, password } = request.body;
  const isEmailExisted = await StudentModel.findOne({ email });
  try {
    if (!isEmailExisted) {
      response.status(401).send({ message: "User not found" });
      return;
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await StudentModel.updateOne({ email }, { password: hashedPassword });
      response.status(200).send("Success");
      return;
    }
  } catch (err) {
    response.status(401).send("ajillahgvi bn");
  }
};
