import { Request, Response } from "express";
import { Mongoose } from "mongoose";
import { NotificationModel } from "../model/student-booking-model";

export const getNotification = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const notification = await NotificationModel.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).send({ notification, success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};
