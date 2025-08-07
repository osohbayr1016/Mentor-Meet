import { NextFunction, Request, Response } from "express";
import { MentorModel, UserRoleEnum } from "../model/mentor-model";

export const isMentor = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { mentorId } = response.locals;

  try {
    const user = await MentorModel.findById(mentorId);

    if (!user) {
      return response.status(404).send({ message: "User not found" });
    }

    if (user.role === UserRoleEnum.MENTOR) {
      next();
      return;
    }
    response.status(401).send({ message: "Unauthorized user" });
    return;
  } catch (error: any) {
    console.error("Token verification error:", error.message);
    response.status(400).send({ message: "Token is invalid" });
    return;
  }
};
