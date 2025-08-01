"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorCreateProfileStep2 = void 0;
const mentor_model_1 = require("../model/mentor-model");
const MentorCreateProfileStep2 = async (req, res) => {
    const { mentorId } = res.locals;
    const { bio, description, socialLinks, specialization, achievements } = req.body;
    try {
        const parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
        const updatedMentor = await mentor_model_1.MentorModel.findByIdAndUpdate({ _id: mentorId }, {
            bio,
            description,
            socialLinks: parsedSocialLinks,
            specialization,
            achievements,
            updatedAt: new Date(),
        }, { new: true });
        if (!updatedMentor) {
            return res.status(404).json({ message: "Ментор олдсонгүй." });
        }
        return res.status(200).send({ message: "Алхам 2 амжилттай хадгалагдлаа.", mentor: updatedMentor });
    }
    catch (err) {
        console.error("Алдаа:", err.message || err);
        return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
    }
};
exports.MentorCreateProfileStep2 = MentorCreateProfileStep2;
