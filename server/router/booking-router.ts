import { Router } from "express";
import { createBooking } from "../controller/create-booking";
import { getBooking } from "../controller/get-bookings";

export const BookingRouter = Router();

BookingRouter.post("/booking", createBooking);
BookingRouter.get("/get-booking", getBooking);
