import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const MentorTokenChecker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Токен шаардлагатай! Bearer форматтай илгээнэ үү." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Токенын формат буруу!" });
  }

  const secret = process.env.JWT_SECRET;
  console.log(secret, "secret");

  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return res.status(500).json({ message: "Сервер тохиргооны алдаа!" });
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      mentorId: string;
      isMentor: true;
      email: string;
    };

    console.log("Decoded JWT:", decoded);

    if (!decoded.isMentor) {
      res.status(403).json({
        message: "Зөвхөн Mentor эрхтэй хэрэглэгч хандах боломжтой!",
      });
      return;
    }

    res.locals.mentorId = decoded.mentorId;
    res.locals.isMentor = true;
    res.locals.email = decoded.email;

    next();
    return;
  } catch (err: any) {
    console.error("Token error:", err.message);
    return res
      .status(401)
      .json({ message: "JWT баталгаажсангүй! Токен хүчингүй байна." });
  }
};
