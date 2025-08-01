"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMentor = void 0;
const mentor_model_1 = require("../model/mentor-model");
const isMentor = async (request, response, next) => {
    const { mentorId } = response.locals;
    try {
        const user = await mentor_model_1.MentorModel.findById(mentorId);
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
};
exports.isMentor = isMentor;
