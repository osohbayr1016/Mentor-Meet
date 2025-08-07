import { Request, Response, NextFunction } from "express";
import { verifyToken as verifyJwtToken } from "../utils/jwt-utils";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET is not defined" });
  }

  try {
    const decoded = verifyJwtToken(token) as {
      studentId?: string;
      mentorId?: string;
      email: string;
    };

    // аль ч хэрэглэгчдэд зөвшөөрнө
    if (!decoded.studentId && !decoded.mentorId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.locals.studentId = decoded.studentId;
    res.locals.mentorId = decoded.mentorId;
    res.locals.email = decoded.email;

    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
