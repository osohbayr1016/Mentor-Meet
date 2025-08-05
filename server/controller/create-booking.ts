import { Request, Response } from "express";
import { Booking } from "../model/booking-model";
import { StudentModel } from "../model/student-model";
import { MentorModel } from "../model/mentor-model";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      mentorId,
      studentId,
      date,
      time,


      price,
      category,
      notes,
    } = req.body;

    // Validate required fields
    if (!mentorId || !studentId || !date || !time || !price || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: mentorId, studentId, date, time, price, category",
      });
    }

    // Check if student exists
    const student = await StudentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if mentor exists
    const mentor = await MentorModel.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const booking = new Booking({
      mentorId,
      studentId,
      date: new Date(date),
      time,
      price,
      category,
      notes,
      status: "PENDING",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: {
        _id: booking._id,
        mentorId: booking.mentorId,
        studentId: booking.studentId,
        date: booking.date,
        time: booking.time,
        price: booking.price,
        category: booking.category,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
//???
