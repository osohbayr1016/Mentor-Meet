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
exports.MentorLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mentor_model_1 = require("../model/mentor-model");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const MentorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, googleAuth } = req.body;
        if (!email) {
            return res
                .status(400)
                .send({ message: "Имайл шаардлагатай!" });
        }
        // For traditional login, password is required
        if (!googleAuth && !password) {
            return res
                .status(400)
                .send({ message: "Нууц үг шаардлагатай!" });
        }
        const mentor = yield mentor_model_1.MentorModel.findOne({ email });
        if (!mentor) {
            return res.status(401).send({ message: "Имайл буруу байна!" });
        }
        // For Google OAuth users, skip password validation
        if (!googleAuth) {
            if (!mentor.password) {
                return res.status(401).send({ message: "Энэ хэрэглэгч Google-р бүртгэгдсэн байна!" });
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, mentor.password);
            if (!isPasswordValid) {
                return res.status(401).send({ message: "Нууц үг буруу байна!" });
            }
        }
        else {
            // For Google OAuth users, verify they have googleAuth enabled
            if (!mentor.googleAuth) {
                return res.status(401).send({ message: "Энэ хэрэглэгч Google-р бүртгэгдээгүй байна!" });
            }
        }
        const secret = process.env.JWT_SECRET;
        console.log(secret, "login secter");
        if (!secret)
            return res.status(500).send({ message: "JWT тохиргоо алга байна!" });
        const token = jsonwebtoken_1.default.sign({ mentorId: mentor._id.toString(), isMentor: mentor.role === "MENTOR" }, secret, { expiresIn: "24h" });
        return res.status(200).json({
            message: "Амжилттай нэвтэрлээ",
            token,
            mentorId: mentor._id,
        });
    }
    catch (error) {
        console.error("Login error:", error.message);
        return res
            .status(500)
            .json({ message: "Серверийн алдаа!", error: error.message });
    }
});
exports.MentorLogin = MentorLogin;
