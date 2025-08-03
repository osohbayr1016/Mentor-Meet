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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudents = exports.updateStudentProfile = exports.getStudentProfile = void 0;
const student_model_1 = require("../model/student-model");
// Student profile авах
const getStudentProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ error: "Email шаардлагатай!" });
        }
        const student = yield student_model_1.StudentModel.findOne({ email });
        if (!student) {
            return res.status(404).json({ error: "Student олдсонгүй." });
        }
        const profile = {
            name: student.nickname || "Unknown",
            email: student.email,
            phoneNumber: student.phoneNumber,
            createAt: student.createAt,
            updateAt: student.updateAt,
        };
        res.json(profile);
    }
    catch (err) {
        console.error("getStudentProfile error:", err);
        res.status(500).json({ error: "Student profile авахад алдаа гарлаа." });
    }
});
exports.getStudentProfile = getStudentProfile;
// Student profile шинэчлэх
const updateStudentProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const { nickname, phoneNumber } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email шаардлагатай!" });
        }
        const updateData = {};
        if (nickname)
            updateData.nickname = nickname;
        if (phoneNumber)
            updateData.phoneNumber = phoneNumber;
        updateData.updateAt = new Date();
        const student = yield student_model_1.StudentModel.findOneAndUpdate({ email }, updateData, {
            new: true,
        });
        if (!student) {
            return res.status(404).json({ error: "Student олдсонгүй." });
        }
        const profile = {
            name: student.nickname || "Unknown",
            email: student.email,
            phoneNumber: student.phoneNumber,
            createAt: student.createAt,
            updateAt: student.updateAt,
        };
        res.json(profile);
    }
    catch (err) {
        console.error("updateStudentProfile error:", err);
        res.status(500).json({ error: "Student profile шинэчлэхэд алдаа гарлаа." });
    }
});
exports.updateStudentProfile = updateStudentProfile;
// Бүх student-уудын жагсаалт авах
const getAllStudents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield student_model_1.StudentModel.find({}, { password: 0 }); // password-г хасаж авна
        const profiles = students.map((student) => ({
            name: student.nickname || "Unknown",
            email: student.email,
            phoneNumber: student.phoneNumber,
            createAt: student.createAt,
            updateAt: student.updateAt,
        }));
        res.json(profiles);
    }
    catch (err) {
        console.error("getAllStudents error:", err);
        res
            .status(500)
            .json({ error: "Student-уудын жагсаалт авахад алдаа гарлаа." });
    }
});
exports.getAllStudents = getAllStudents;
