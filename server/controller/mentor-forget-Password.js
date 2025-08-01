"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorForgetPass = void 0;
const mentor_model_1 = require("../model/mentor-model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mentorForgetPass = async (request, response) => {
    const { email, password } = request.body;
    const isEmailExisted = await mentor_model_1.MentorModel.findOne({ email });
    try {
        if (!isEmailExisted) {
            response.status(401).send({ message: "User not found" });
            return;
        }
        else {
            const hashedPassword = bcrypt_1.default.hashSync(password, 10);
            await mentor_model_1.MentorModel.updateOne({ email }, { password: hashedPassword });
            response.status(200).send("Success");
            return;
        }
    }
    catch (err) {
        response.status(401).send("ajillahgvi bn");
    }
};
exports.mentorForgetPass = mentorForgetPass;
