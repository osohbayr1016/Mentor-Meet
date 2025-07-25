import { Router } from "express";
import {
  Checkemail,
  checkOtp,
  createPassword,
  StudentNameNumber,
} from "../controller/student-signup";

export const StudentRouter = Router();

StudentRouter.post("/Checkemail", Checkemail);
StudentRouter.post("/checkOtp", checkOtp);
StudentRouter.post("/createPassword", createPassword);
StudentRouter.post("/StudentNameNumber", StudentNameNumber)