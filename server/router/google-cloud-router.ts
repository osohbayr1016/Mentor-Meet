import { Router } from "express";
import {
  createMeeting,
  getEvents,
  getUserInfo,
  checkCalendarAccess,
} from "../controller/google-cloud-controller";

export const GoogleCloudRouter = Router();

// Google Cloud API endpoints
GoogleCloudRouter.post("/google/meeting", createMeeting);
GoogleCloudRouter.get("/google/events", getEvents);
GoogleCloudRouter.get("/google/user", getUserInfo);
GoogleCloudRouter.get("/google/calendar-access", checkCalendarAccess); 