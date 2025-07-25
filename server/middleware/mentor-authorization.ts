import { NextFunction, Request, Response } from "express";
import { MentorModel, UserRoleEnum } from "../model/mentor-model";


export const isMentor = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { mentorId } = response.locals;

  try {
    const user = await MentorModel.findById({ _id: mentorId });
    console.log(user, "saddsa");

    if (!user) {
      response.status(404).send({ message: "user not found" });
    }
    if (user?.role === UserRoleEnum.MENTOR) {
      console.log(user.role, "lll");

      next();
      return;
    }
    response.status(401).send({ message: "Unauthorized user" });
    return;
  } catch (error) {
    response.status(400).send({ message: "token is invalid" });
  }
};
