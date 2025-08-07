import { Router } from "express";
import { createBooking } from "../controller/create-booking";
import { getBooking } from "../controller/get-bookings";
import { getMentorBookings } from "../controller/getMentorBookings";
import { cancelMeeting } from "../controller/cancel-meeting";

export const BookingRouter = Router();

BookingRouter.post("/bookings", createBooking);
BookingRouter.get("/get-booking", getBooking);
BookingRouter.get("/mentor-bookings/:mentorId", getMentorBookings);


BookingRouter.patch("/bookings/:id/cancel", cancelMeeting);