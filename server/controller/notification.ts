import { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import { NotificationModel } from "../model/student-booking-model";

export const getNotification = async (req: Request, res: Response) => {
  // const { userId } = req.params;
  const {mentorId} =req.params;

  // const userIdObj = new mongoose.Types.ObjectId(userId);
  const userIdObj = new mongoose.Types.ObjectId(mentorId);
  try {
    const notification = await NotificationModel.find({
      // userId: userIdObj,
    }).populate("bookingId").sort({
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
