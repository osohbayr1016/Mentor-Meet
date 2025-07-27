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
    console.log(user, "mentor data");

    if (!user) {
      return response.status(404).send({ message: "User not found" });
    }

    if (user.role === UserRoleEnum.MENTOR) {
      console.log(user.role, "MENTOR verified");
      return next();
    }

    return response.status(401).send({ message: "Unauthorized user" });
  } catch (error: any) {
    console.error("Token verification error:", error.message);
    return response.status(400).send({ message: "Token is invalid" });
  }
};

