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
exports.studentForgetPass = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const student_model_1 = require("../model/student-model");
const studentForgetPass = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const isEmailExisted = yield student_model_1.StudentModel.findOne({ email });
    try {
        if (!isEmailExisted) {
            response.status(401).send({ message: "User not found" });
            return;
        }
        else {
            const hashedPassword = bcrypt_1.default.hashSync(password, 10);
            yield student_model_1.StudentModel.updateOne({ email }, { password: hashedPassword });
            response.status(200).send("Success");
            return;
        }
    }
    catch (err) {
        response.status(401).send("ajillahgvi bn");
    }
});
exports.studentForgetPass = studentForgetPass;
