"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorSignUp = exports.checkOtp = exports.MentorCheckemail = void 0;
const mentor_model_1 = require("../model/mentor-model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Otp_model_1 = require("../model/Otp-model");
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const MentorCheckemail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        console.log("MentorCheckemail request body:", { email });
        // Validate email
        if (!email) {
            console.log("Validation failed: email is missing");
            return res.status(400).json({ message: "Email is required" });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Validation failed: invalid email format");
            return res.status(400).json({ message: "Please enter a valid email address" });
        }
        console.log("Checking if user already exists...");
        const user = yield mentor_model_1.MentorModel.findOne({ email });
        if (user) {
            console.log("User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }
        console.log("Generating OTP code...");
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("OTP code generated:", code);
        console.log("Setting up email transport...");
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "baabarmx@gmail.com",
                pass: "yignruoqpvxgluyq",
            },
        });
        const options = {
            from: "baabarmx@gmail.com",
            to: email,
            subject: "Mentor Meet - Email Verification",
            html: `<div style="color:red">Your verification code is: ${code}</div>`,
        };
        console.log("Creating OTP record in database...");
        yield Otp_model_1.OtpModel.create({ code, email });
        console.log("OTP record created successfully");
        console.log("Sending email...");
        yield transport.sendMail(options);
        console.log("Email sent successfully");
        return res.status(200).json({ message: "Verification code sent successfully" });
    }
    catch (error) {
        console.error("Checkemail error details:", {
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error',
            stack: error === null || error === void 0 ? void 0 : error.stack,
            name: (error === null || error === void 0 ? void 0 : error.name) || 'Error'
        });
        return res.status(500).json({
            message: "Internal server error",
            details: process.env.NODE_ENV === 'development' ? error === null || error === void 0 ? void 0 : error.message : undefined
        });
    }
});
exports.MentorCheckemail = MentorCheckemail;
const checkOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, email } = req.body;
    try {
        // Validate required fields
        if (!code || !email) {
            return res.status(400).json({ message: "Code and email are required" });
        }
        const isOtpExisting = yield Otp_model_1.OtpModel.findOne({
            code: code,
            email: email,
        });
        if (!isOtpExisting) {
            return res.status(400).json({ message: "Invalid verification code" });
        }
        // Check if OTP is expired (optional: add expiration logic)
        // const now = new Date();
        // const otpCreated = new Date(isOtpExisting.createdAt);
        // const diffInMinutes = (now.getTime() - otpCreated.getTime()) / (1000 * 60);
        // if (diffInMinutes > 10) { // 10 minutes expiration
        //   return res.status(400).json({ message: "Verification code has expired" });
        // }
        return res.status(200).json({ message: "Verification successful" });
    }
    catch (err) {
        console.error("OTP check error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.checkOtp = checkOtp;
const MentorSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, googleAuth, googleData } = req.body;
    try {
        console.log("MentorSignUp request body:", {
            email,
            password: password ? "***" : "undefined",
            googleAuth,
            googleData: googleData ? "EXISTS" : "undefined"
        });
        // Validate required fields
        if (!email) {
            console.log("Validation failed: missing email");
            return res.status(400).json({
                message: "Email is required"
            });
        }
        // For Google OAuth users, password is optional
        if (!googleAuth && !password) {
            console.log("Validation failed: missing password for non-Google auth");
            return res.status(400).json({
                message: "Password is required"
            });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Validation failed: invalid email format");
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }
        // Validate password length for non-Google auth users
        if (!googleAuth && password && password.length < 6) {
            console.log("Validation failed: password too short");
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }
        console.log("Loading environment variables...");
        dotenv_1.default.config();
        const tokenPassword = process.env.JWT_SECRET;
        if (!tokenPassword) {
            console.error("JWT_SECRET not found in environment variables");
            throw new Error("JWT_SECRET not defined");
        }
        console.log("JWT_SECRET loaded successfully");
        console.log("Checking if user already exists...");
        const FindUser = yield mentor_model_1.MentorModel.findOne({ email });
        if (FindUser) {
            console.log("User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }
        console.log("Creating new user...");
        // Prepare user data
        const userData = {
            email,
        };
        // Handle password for traditional signup
        if (!googleAuth && password) {
            console.log("Starting password hashing...");
            const hashedPassword = yield bcrypt_1.default.hashSync(password, 10);
            console.log("Password hashed successfully");
            userData.password = hashedPassword;
        }
        // Handle Google OAuth data
        if (googleAuth && googleData) {
            console.log("Processing Google OAuth data...");
            if (googleData.name) {
                const nameParts = googleData.name.split(" ");
                userData.firstName = nameParts[0] || "";
                userData.lastName = nameParts.slice(1).join(" ") || "";
            }
            if (googleData.image) {
                userData.image = googleData.image;
            }
            // For Google OAuth users, we don't set a password
            userData.googleAuth = true;
        }
        const user = yield mentor_model_1.MentorModel.create(userData);
        console.log("User created successfully:", user._id);
        console.log("Generating JWT token...");
        const token = jsonwebtoken_1.default.sign({
            mentorId: user._id,
            isMentor: true,
            email: user.email,
        }, tokenPassword);
        console.log("JWT token generated successfully");
        console.log("Sending success response...");
        return res.status(200).json({
            message: "Амжилттай бүртгэгдлээ.",
            token,
            mentorId: user._id.toString()
        });
    }
    catch (err) {
        console.error("MentorSignUp error details:", {
            message: (err === null || err === void 0 ? void 0 : err.message) || 'Unknown error',
            stack: err === null || err === void 0 ? void 0 : err.stack,
            name: (err === null || err === void 0 ? void 0 : err.name) || 'Error'
        });
        return res.status(500).json({
            message: "Internal server error",
            details: process.env.NODE_ENV === 'development' ? err === null || err === void 0 ? void 0 : err.message : undefined
        });
    }
});
exports.MentorSignUp = MentorSignUp;
// export const MentorSignUp = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     if (
//       !email ||
//       !password ||
//       typeof email != "string" ||
//       typeof password !== "string"
//     ) {
//       res.status(400).send({ message: "Имайл, нууц үг шаардлагатай!" });
//       return;
//     }
//     const isEmailExisted = await MentorModel.findOne({ email });
//     if (!isEmailExisted) {
//       const hashedPassword = await bcrypt.hashSync(password, 10);
//       await MentorModel.create({ email, password: hashedPassword });
//       res.send({ message: "Амжилттай бүртгэгдлээ." });
//       return;
//     }
//     res.send({ message: "Хэрэглэгч бүртгэлтэй байна!" });
//   } catch (err) {
//     console.error({ message: "Бүртгэлд алдаа гарлаа" });
//     return res.status(500).send({ message: "Серверт алдаа гарлаа" });
//   }
// };
