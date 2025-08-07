import { Request,Response } from "express";
import { MentorModel } from "../model/mentor-model";

export const MentorCreateProfileStep3 = async (req: Request, res: Response): Promise<any> => {
  const { mentorId } = res.locals;
  const { category, bankAccount } = req.body;

  try {
    const parsedBankAccount = typeof bankAccount === 'string' ? JSON.parse(bankAccount) : bankAccount;
    const updatedMentor = await MentorModel.findByIdAndUpdate(
      { _id: mentorId },
      {
        category: { 
          price: category.price,
          categoryId: category.categoryId 
        },
        bankAccount: parsedBankAccount,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedMentor) {
      return res.status(404).json({ message: "Ментор олдсонгүй." });
    }

    return res.status(200).send({ message: "Алхам 3 амжилттай хадгалагдлаа.", mentor: updatedMentor });
  } catch (err: any) {
    console.error("Алдаа:", err.message || err);
    return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
  }
};
