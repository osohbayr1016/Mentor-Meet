import { Request, Response } from "express";
import { Booking, BookingStatus } from "../model/booking-model";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      mentorId,
      studentId,
      date,
      times,
      price,
      category,
    } = req.body;

    
    if (!mentorId || !studentId || !date || !times || !price || !category) {
      return res.status(400).json({ message: "Бүх талбарыг бүрэн бөглөнө үү." });
    }

    if (!Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ message: "Цагийн мэдээлэл буруу байна." });
    }

    const bookingDate = new Date(date);

    
    const conflictingBookings = await Booking.find({
      mentorId,
      date: bookingDate,
      times: { $in: times },
    });

    if (conflictingBookings.length > 0) {
      
      const bookedTimes = conflictingBookings.flatMap((booking) =>
        booking.times.filter((t) => times.includes(t))
      );

      return res.status(409).json({
        message: `Дараах цагууд аль хэдийн захиалагдсан байна: ${bookedTimes.join(", ")}`,
        bookedTimes,
      });
    }

    
    const newBooking = new Booking({
      mentorId,
      studentId,
      date: bookingDate,
      times,
      price,
      category,
      status: BookingStatus.PENDING,
    });

    await newBooking.save();

    return res.status(201).json({
      message: "Захиалга амжилттай үүсгэгдлээ.",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Захиалга үүсгэхэд алдаа гарлаа:", error);
    return res.status(500).json({
      message: "Сервер дээр алдаа гарлаа. Та дахин оролдоно уу.",
    });
  }
};
