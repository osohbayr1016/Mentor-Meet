import express from "express";
import { studentCancelMeeting } from "../controller/meeting/student-cancel-meeting";
import { mentorCancelMeeting } from "../controller/meeting/mentor-cancel-meeting";
import { replaceStudentForMeeting } from "../controller/meeting/ReplaceStudentForMeeting";
import { getAvailableReplacements } from "../controller/meeting/getAvailableReplacements";
import { verifyToken } from "../middleware/token-checker"; 


const router = express.Router();

// Оюутан уулзалт цуцлах (4+ цаг бол орлуулагчийн горимд орно)
router.post("/student/cancel", verifyToken, studentCancelMeeting);

// Mentor хүссэн үедээ уулзалт цуцлах
router.post("/mentor/cancel", verifyToken, mentorCancelMeeting);

// Орлуулагчийн жагсаалт авах (optional)
router.get("/replacements/:meetingId", verifyToken, getAvailableReplacements);

// Орлуулагч баталгаажуулах (admin эсвэл system logic)
router.post("/replace", verifyToken, replaceStudentForMeeting);

export default router;
