import { Request, Response } from "express";
import { StudentModel } from "../model/student-model";
import { Booking, BookingStatus } from "../model/booking-model";
import { MentorModel } from "../model/mentor-model";

// Get student's booked meetings
export const getStudentBookings = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const bookings = await Booking.find({ studentId })
      .populate("mentorId", "firstName lastName image profession rating")
      .sort({ date: 1 });

    // Separate upcoming and past bookings
    const now = new Date();
    const upcomingBookings = bookings.filter((booking) => {
      // Use the earliest time slot for comparison
      const earliestTime = booking.times[0]; // Or sort times if needed
      if (!earliestTime) return false;

      const [hour, minute] = earliestTime.split(":").map((part) => parseInt(part));
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(hour, minute);
      return bookingDate > now && booking.status !== BookingStatus.CANCELLED;
    });

    const pastBookings = bookings.filter((booking) => {
      const earliestTime = booking.times[0]; // Or sort times if needed
      if (!earliestTime) return true;

      const [hour, minute] = earliestTime.split(":").map((part) => parseInt(part));
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(hour, minute);
      return bookingDate <= now || booking.status === BookingStatus.CANCELLED;
    });

    res.json({
      success: true,
      data: {
        upcoming: upcomingBookings.map((b) => ({
          _id: b._id,
          mentorId: b.mentorId,
          studentId: b.studentId,
          date: b.date,
          times: b.times, 
          status: b.status,
          price: b.price,
          category: b.category,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        })),
        past: pastBookings.map((b) => ({
          _id: b._id,
          mentorId: b.mentorId,
          studentId: b.studentId,
          date: b.date,
          times: b.times, 
          status: b.status,
          price: b.price,
          category: b.category,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        })),
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

    // Type assertion for populated mentorId
    const populatedBooking = booking.toObject();
    const mentorId = populatedBooking.mentorId as any;

    // Here you would typically generate a meeting link
    // For now, we'll just return success
    res.json({
      success: true,
      message: "Joining meeting",
      data: {
        meetingLink: `https://meet.google.com/abc-defg-hij`, // Mock link
        mentorName: `${mentorId.firstName} ${mentorId.lastName}`,
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

    const student = await StudentModel.findById(studentId).select("-password");

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
