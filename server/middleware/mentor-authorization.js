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
exports.isMentor = void 0;
const mentor_model_1 = require("../model/mentor-model");
const isMentor = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId } = response.locals;
    try {
        const user = yield mentor_model_1.MentorModel.findById(mentorId);
        console.log(user, "mentor data");
        if (!user) {
            return response.status(404).send({ message: "User not found" });
        }
        if (user.role === mentor_model_1.UserRoleEnum.MENTOR) {
            console.log(user.role, "MENTOR verified");
            return next();
        }
        return response.status(401).send({ message: "Unauthorized user" });
    }
    catch (error) {
        console.error("Token verification error:", error.message);
        return response.status(400).send({ message: "Token is invalid" });
    }
});
exports.isMentor = isMentor;
