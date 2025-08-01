"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentForgetPass = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const student_model_1 = require("../model/student-model");
const studentForgetPass = async (request, response) => {
    const { email, password } = request.body;
    const isEmailExisted = await student_model_1.StudentModel.findOne({ email });
    try {
        if (!isEmailExisted) {
            response.status(401).send({ message: "User not found" });
            return;
        }
        else {
            const hashedPassword = bcrypt_1.default.hashSync(password, 10);
            await student_model_1.StudentModel.updateOne({ email }, { password: hashedPassword });
            response.status(200).send("Success");
            return;
        }
    }
    catch (err) {
        response.status(401).send("ajillahgvi bn");
    }
};
exports.studentForgetPass = studentForgetPass;
