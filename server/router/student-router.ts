import { Router } from "express";
import {
  Checkemail,
  checkOtp,
  createPassword,
  StudentNameNumber,
} from "../controller/student-signup";
import { StudentLogin } from "../controller/student-login";
import { studentForgetPass } from "../controller/student-forgot-password";

export const StudentRouter = Router();

StudentRouter.post("/Checkemail", Checkemail);
StudentRouter.post("/checkOtp", checkOtp);
StudentRouter.post("/createPassword", createPassword);
StudentRouter.post("/StudentNameNumber", StudentNameNumber);
StudentRouter.post("/Studentlogin", StudentLogin);
StudentRouter.put("/StudentForgotPassword", studentForgetPass);
