"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorCreateProfileStep3 = void 0;
const mentor_model_1 = require("../model/mentor-model");
const MentorCreateProfileStep3 = async (req, res) => {
    const { mentorId } = res.locals;
    const { category, bankAccount } = req.body;
    try {
        const parsedBankAccount = typeof bankAccount === 'string' ? JSON.parse(bankAccount) : bankAccount;
        const updatedMentor = await mentor_model_1.MentorModel.findByIdAndUpdate({ _id: mentorId }, {
            category: { price: category.price },
            bankAccount: parsedBankAccount,
            updatedAt: new Date(),
        }, { new: true });
        if (!updatedMentor) {
            return res.status(404).json({ message: "Ментор олдсонгүй." });
        }
        return res.status(200).send({ message: "Алхам 3 амжилттай хадгалагдлаа.", mentor: updatedMentor });
    }
    catch (err) {
        console.error("Алдаа:", err.message || err);
        return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
    }
};
exports.MentorCreateProfileStep3 = MentorCreateProfileStep3;
