import jwt from "jsonwebtoken";

export interface StudentTokenPayload {
  studentId: string;
  email: string;
}

export interface MentorTokenPayload {
  mentorId: string;
  email: string;
  isMentor?: boolean;
}

export const createStudentToken = (
  studentId: string,
  email: string
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const payload: StudentTokenPayload = {
    studentId: studentId.toString(),
    email,
  };

  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

export const createMentorToken = (
  mentorId: string,
  email: string,
  isMentor: boolean = true
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const payload: MentorTokenPayload = {
    mentorId: mentorId.toString(),
    email,
    isMentor,
  };

  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, secret) as StudentTokenPayload | MentorTokenPayload;
};
