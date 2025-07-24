import { Router } from "express";
import { Checkemail, checkOtp, updatePassword } from "../controller/student-signup";


export const StudentRouter = Router();


StudentRouter.post("/Checkemail", Checkemail)
StudentRouter.post("/checkOtp",checkOtp)
StudentRouter.post("/updatePassword ",updatePassword )
