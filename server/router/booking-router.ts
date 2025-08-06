import { Router } from "express";
import { createBooking } from "../controller/create-booking";

export const BookingRouter=Router();

BookingRouter.post("/booking", createBooking)