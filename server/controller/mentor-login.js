"use strict";
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
const MentorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .send({ message: "Имайл болон нууц үг шаардлагатай!" });
        }
        const mentor = await mentor_model_1.MentorModel.findOne({ email });
        if (!mentor) {
            return res.status(401).send({ message: "Имайл буруу байна!" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, mentor.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Нууц үг буруу байна!" });
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
};
exports.MentorLogin = MentorLogin;
