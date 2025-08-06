import { Request, Response } from "express";
import { Booking } from "../model/booking-model";
import { StudentModel } from "../model/student-model";
import { MentorModel } from "../model/mentor-model";
import { NotificationModel } from "../model/student-booking-model";
import mongoose from "mongoose";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { mentorId, studentId, date, times, price, category } = req.body;

    if (!mentorId || !studentId || !date || !times || !price || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: mentorId, studentId, date, times, price, category",
      });
    }

    if (!Array.isArray(times) || times.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Times must be a non-empty array",
      });
    }

    const student = await StudentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const mentor = await MentorModel.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const bookings = [];

    const booking = new Booking({
      mentorId,
      studentId,
      date: new Date(date),
      times,
      price: Number(price),
      category,
      status: "PENDING",
    });

    await booking.save();
    bookings.push(booking);

    const notification = new NotificationModel({
      userId: mentorId,
      bookingId: booking._id,
    });

    await notification.save();

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid mentorId" });
    }

    try {
      await notification.save();
      console.log("Notification saved:", notification);
    } catch (error) {
      console.error("Error saving notification:", error);
    }

    return res.status(201).json({
      success: true,
      message: "Bookings created successfully",
      bookings: bookings.map((b) => ({
        _id: b._id,
        mentorId: b.mentorId,
        studentId: b.studentId,
        date: b.date,
        times: b.times,
        price: b.price,
        category: b.category,
        status: b.status,
        createdAt: b.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error creating bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create bookings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
//???
