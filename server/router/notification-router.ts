import { Router } from "express";
import { getNotification } from "../controller/notification";

export const NotificationRouter = Router();

// NotificationRouter.get("/notification/:id", getNotification);
NotificationRouter.get("/notification/:mentorId", getNotification);
