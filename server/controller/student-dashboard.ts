import { Request, Response } from "express";
import { Student } from "../model/student-model";
import { Booking, BookingStatus } from "../model/booking-model";
import { Mentor } from "../model/mentor-model";

// Get student's booked meetings
export const getStudentBookings = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const bookings = await Booking.find({ studentId })
      .populate("mentorId", "firstName lastName image profession rating")
      .sort({ date: 1, time: 1 });

    // Separate upcoming and past bookings
    const now = new Date();
    const upcomingBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(
        parseInt(booking.time.split(":")[0]),
        parseInt(booking.time.split(":")[1])
      );
      return bookingDate > now && booking.status !== BookingStatus.CANCELLED;
    });

    const pastBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(
        parseInt(booking.time.split(":")[0]),
        parseInt(booking.time.split(":")[1])
      );
      return bookingDate <= now || booking.status === BookingStatus.CANCELLED;
    });

    res.json({
      success: true,
      data: {
        upcoming: upcomingBookings,
        past: pastBookings,
      },
    });
  } catch (error) {
    console.error("Error fetching student bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// Cancel a booking
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { studentId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, studentId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    booking.status = BookingStatus.CANCELLED;
    booking.updatedAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

// Join meeting (for future implementation with video call)
export const joinMeeting = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { studentId } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      studentId,
    }).populate("mentorId", "firstName lastName");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      return res.status(400).json({
        success: false,
        message: "Meeting is not confirmed",
      });
    }

    // Here you would typically generate a meeting link
    // For now, we'll just return success
    res.json({
      success: true,
      message: "Joining meeting",
      data: {
        meetingLink: `https://meet.google.com/abc-defg-hij`, // Mock link
        mentorName: `${booking.mentorId.firstName} ${booking.mentorId.lastName}`,
        booking,
      },
    });
  } catch (error) {
    console.error("Error joining meeting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to join meeting",
    });
  }
};

// Get student profile
export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student profile",
    });
  }
};
