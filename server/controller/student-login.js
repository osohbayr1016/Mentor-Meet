"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const student_model_1 = require("../model/student-model");
const StudentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: "Имайл болон нууц үг шаардлагатай!" });
        }
        const student = await student_model_1.StudentModel.findOne({ email });
        if (!student) {
            return res.status(400).send({ message: "Имайл буруу байна!" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Нууц үг буруу байна!" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: student.id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        res.json({
            token,
            user: {
                id: student.id,
                email: student.email
            },
        });
    }
    catch (error) {
        console.log("Login error:", error.message);
        res.status(500).json({ message: " Серверийн алдаа!", error: error.message });
        return;
    }
};
exports.StudentLogin = StudentLogin;
