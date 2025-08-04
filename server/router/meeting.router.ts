import express from "express";
import { studentCancelMeeting } from "../controller/meeting/student-cancel-meeting";
import { mentorCancelMeeting } from "../controller/meeting/mentor-cancel-meeting";
import { replaceStudentForMeeting } from "../controller/meeting/replaceStudentForMeeting";
import { getAvailableReplacements } from "../controller/meeting/getAvailableReplacements";
import { verifyToken } from "../middleware/token-checker"; 


const router = express.Router();


router.post("/student/cancel", verifyToken, studentCancelMeeting);


router.post("/mentor/cancel", verifyToken, mentorCancelMeeting);


router.get("/replacements/:meetingId", verifyToken, getAvailableReplacements);


router.post("/replace", verifyToken, replaceStudentForMeeting);

export default router;
