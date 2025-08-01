"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorTokenChecker = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const MentorTokenChecker = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
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
    }
    catch (err) {
        console.error("Token error:", err.message);
        return res
            .status(401)
            .json({ message: "JWT баталгаажсангүй! Токен хүчингүй байна." });
    }
};
exports.MentorTokenChecker = MentorTokenChecker;
