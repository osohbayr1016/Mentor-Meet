import { Request, Response } from "express";
import { Booking } from "../model/booking-model";

interface UpdateBookingMeetingRequest {
    meetingLink: string;
    calendarEventId: string;
    meetingStartTime?: string;
    meetingEndTime?: string;
}

export const updateBookingMeeting = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { meetingLink, calendarEventId, meetingStartTime, meetingEndTime }: UpdateBookingMeetingRequest = req.body;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required"
            });
        }

        if (!meetingLink || !calendarEventId) {
            return res.status(400).json({
                success: false,
                message: "Meeting link and calendar event ID are required"
            });
        }

        // Find and update the booking
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                meetingLink,
                calendarEventId,
                ...(meetingStartTime && { meetingStartTime: new Date(meetingStartTime) }),
                ...(meetingEndTime && { meetingEndTime: new Date(meetingEndTime) }),
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('mentorId studentId');

        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        console.log(`Google Meet link added to booking ${bookingId}:`, meetingLink);

        return res.status(200).json({
            success: true,
            message: "Booking updated with Google Meet link successfully",
            data: {
                bookingId: updatedBooking._id,
                meetingLink: updatedBooking.meetingLink,
                calendarEventId: updatedBooking.calendarEventId,
                status: updatedBooking.status
            }
        });

    } catch (error) {
        console.error("Error updating booking with meeting link:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error while updating booking",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};