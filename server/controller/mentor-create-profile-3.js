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
exports.MentorCreateProfileStep3 = void 0;
const mentor_model_1 = require("../model/mentor-model");
const MentorCreateProfileStep3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mentorId } = res.locals;
    const { category, bankAccount } = req.body;
    try {
        const parsedBankAccount = typeof bankAccount === 'string' ? JSON.parse(bankAccount) : bankAccount;
        const updatedMentor = yield mentor_model_1.MentorModel.findByIdAndUpdate({ _id: mentorId }, {
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
});
exports.MentorCreateProfileStep3 = MentorCreateProfileStep3;
