import { Router } from "express";
import { createBooking } from "../controller/create-booking";
import { getBooking } from "../controller/get-bookings";
import { getBookingMentor } from "../controller/getBookingMentor";

export const BookingRouter = Router();

BookingRouter.post("/booking", createBooking);
BookingRouter.get("/get-booking", getBooking);
BookingRouter.get("/get-booking/:mentorId", getBookingMentor);
