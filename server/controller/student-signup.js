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
exports.StudentNameNumber = exports.createPassword = exports.checkOtp = exports.Checkemail = exports.Hello = void 0;
const student_model_1 = require("../model/student-model");
const nodemailer_1 = __importDefault(require("nodemailer"));
const Otp_model_1 = require("../model/Otp-model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Hello = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ message: "hello" });
});
exports.Hello = Hello;
const Checkemail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = yield student_model_1.StudentModel.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already existed" });
            return;
        }
        const tempUserExists = yield student_model_1.TempUserModel.findOne({ email });
        if (tempUserExists) {
            yield student_model_1.TempUserModel.deleteOne({ email });
        }
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "jochuekimmich@gmail.com",
                pass: "xcyqnkwxrykxstna",
            },
        });
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        yield student_model_1.TempUserModel.create({ email, code });
        const options = {
            from: "jochuekimmich@gmail.com",
            to: email,
            subject: "Баталгаажуулах код",
            html: `
      <p>Сайн байна уу! Та өөрийн имайл хаягыг баталгаажуулж дараах (OTP) кодыг оруулна уу?:</p>
     <div style="font-size: 32px; font-weight: bold; color: black; margin: 20px 0; letter-spacing: 5px;">
  ${code}
</div>
`
        };
        yield Otp_model_1.OtpModel.create({ email, code });
        yield transport.sendMail(options);
        return res.status(200).json({ message: "Email OK" });
    }
    catch (error) {
        console.error("Checkemail error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.Checkemail = Checkemail;
const checkOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    try {
        const isOtpExisting = yield Otp_model_1.OtpModel.findOne({
            code: code,
        });
        if (!isOtpExisting) {
            res.status(400).send("wrong code");
            return;
        }
        const tempUser = yield student_model_1.TempUserModel.findOne({ email, code });
        if (!tempUser) {
            res.status(400).json({ message: "Wrong OTP code" });
            return;
        }
        tempUser.isVerified = true;
        yield tempUser.save();
        res.status(200).send({ message: "success", isOtpExisting });
    }
    catch (err) {
        res.status(400).send("Wrong code");
    }
});
exports.checkOtp = checkOtp;
const createPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const tempUser = yield student_model_1.TempUserModel.findOne({ email, isVerified: true });
        if (!tempUser) {
            return res.status(400).json({ message: "Email not verified or invalid" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        tempUser.password = hashedPassword;
        yield tempUser.save();
        res.send({ message: "Successfully updated password" });
        return;
    }
    catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
});
exports.createPassword = createPassword;
const StudentNameNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, nickname, phoneNumber, googleAuth, googleData } = req.body;
    try {
        // For Google OAuth users, skip temp user verification
        if (googleAuth) {
            console.log("Processing Google OAuth student signup:", { email, nickname, phoneNumber });
            // Check if student already exists
            const existingStudent = yield student_model_1.StudentModel.findOne({ email });
            if (existingStudent) {
                return res.status(400).json({ message: "User already exists" });
            }
            // Create student directly with Google data
            const student = yield student_model_1.StudentModel.create({
                email,
                nickname,
                phoneNumber,
                googleAuth: true,
                // No password for Google OAuth users
            });
            if (!process.env.JWT_SECRET)
                throw new Error("JWT_SECRET not defined");
            const token = jsonwebtoken_1.default.sign({ userId: student._id }, process.env.JWT_SECRET);
            return res.status(200).json({
                message: "Successfully created student with Google OAuth",
                user: {
                    _id: student._id,
                    email: student.email,
                    nickname: student.nickname,
                    phoneNumber: student.phoneNumber,
                },
                token
            });
        }
        // Traditional signup flow
        const tempUser = yield student_model_1.TempUserModel.findOne({ email, isVerified: true, password: { $exists: true } });
        if (!tempUser) {
            return res.status(400).json({ message: "Email not verified or password not set" });
        }
        tempUser.nickname = nickname;
        tempUser.phoneNumber = phoneNumber;
        yield tempUser.save();
        const existingStudent = yield student_model_1.StudentModel.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: "User already exists in main collection" });
        }
        const student = yield student_model_1.StudentModel.create({
            email: tempUser.email,
            password: tempUser.password,
            nickname: tempUser.nickname,
            phoneNumber: tempUser.phoneNumber,
        });
        yield student_model_1.TempUserModel.deleteOne({ email });
        if (!process.env.JWT_SECRET)
            throw new Error("JWT_SECRET not defined");
        const token = jsonwebtoken_1.default.sign({ userId: student._id }, process.env.JWT_SECRET);
        return res.status(200).json({
            message: "Successfully updated name and number",
            tempUser,
            token
        });
    }
    catch (error) {
        console.error("StudentNameNumber error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.StudentNameNumber = StudentNameNumber;
