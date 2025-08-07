import "express";
declare module "express-serve-static-core" {
  interface Request {
    mentorId?: string;
    studentId?: string;
    email?: string;
  }
}