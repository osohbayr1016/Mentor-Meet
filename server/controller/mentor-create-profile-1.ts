import { Request, Response } from "express";
import { MentorModel } from "../model/mentor-model";
import mongoose from "mongoose";
import { CategoryModel } from "../model/category-model";

export const MentorCreateProfile1 = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { mentorId } = res.locals;
  const { category } = req.body;

  if (
    !category?.categoryId ||
    !mongoose.Types.ObjectId.isValid(category.categoryId)
  ) {
    return res.status(400).json({ message: "Зөв categoryId оруулна уу." });
  }
  console.log("mentorId:", mentorId);

  try {
    const {
      firstName,
      lastName,
      nickName,
      category,
      careerDuration,
      profession,
      image,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !nickName ||
      !category?.categoryId ||
      !category?.price ||
      !careerDuration ||
      !profession ||
      !image
    ) {
      return res
        .status(400)
        .send({ message: "Мэдээлэл дутуу байна. Бүх талбарыг бөглөнө үү." });
    }

    const foundCategory = await CategoryModel.findOne({
      _id: category.categoryId,
    });

    if (!foundCategory) {
      return res.status(400).json({ message: "Ийм нэртэй ангилал олдсонгүй!" });
    }

    const updatedMentor = await MentorModel.findByIdAndUpdate(
      { _id: mentorId },
      {
        firstName,
        lastName,
        nickName,
        category: {
          categoryId: foundCategory._id,
          price: category.price,
        },
        experience: {
          careerDuration,
        },
        profession,
        image,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return res.status(200).send({
      message: "Менторын профайл амжилттай хадгалагдлаа.",
      mentor: updatedMentor,
    });
  } catch (err: any) {
    console.error("Алдаа:", err.message || err);
    return res
      .status(500)
      .json({ message: "Сервер дээр алдаа гарлаа. Дахин оролдоно уу." });
  }
};

// import { Request, Response } from "express";
// import { MentorModel } from "../model/mentor-model";
// import mongoose from "mongoose";
// import { CategoryModel } from "../model/category-model";

// export const MentorCreateProfile1 = async (req: Request, res: Response): Promise<any> => {
//   const { mentorId } = res.locals;
//   const { category } = req.body;

//   if (!category?.categoryId || !mongoose.Types.ObjectId.isValid(category.categoryId)) {
//     return res.status(400).json({ message: "Зөв categoryId оруулна уу." });
//   }

//   try {
//     const {
//       firstName,
//       lastName,
//       nickName,
//       category,
//       careerDuration,
//       profession,
//       image,
//       bio,
//       description,
//       socialLinks,
//       specialization,
//       achievements,
//       bankAccount,
//     } = req.body;

//     if (!firstName || !lastName || !category?.categoryId || !category?.price || !careerDuration || !profession || !image) {
//       return res.status(400).send({ message: "Мэдээлэл дутуу байна. Заавал бөглөх талбаруудыг бөглөнө үү." });
//     }

//     const foundCategory = await CategoryModel.findOne({ _id: category.categoryId });
//     if (!foundCategory) {
//       return res.status(400).json({ message: "Ийм нэртэй ангилал олдсонгүй!" });
//     }

//     const parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
//     const parsedBankAccount = typeof bankAccount === 'string' ? JSON.parse(bankAccount) : bankAccount;

//     const updatedMentor = await MentorModel.findByIdAndUpdate(
//       { _id: mentorId },
//       {
//         firstName,
//         lastName,
//         nickName,
//         category: {
//           categoryId: foundCategory._id,
//           price: category.price,
//         },
//         experience: {
//           careerDuration,
//         },
//         profession,
//         image,
//         bio,
//         description,
//         socialLinks: parsedSocialLinks,
//         specialization,
//         achievements,
//         bankAccount: parsedBankAccount,
//         updatedAt: new Date(),
//       },
//       { new: true, upsert: true }
//     );

//     return res.status(200).send({
//       message: "Менторын профайл амжилттай хадгалагдлаа.",
//       mentor: updatedMentor,
//     });
//   } catch (err: any) {
//     console.error("Алдаа:", err.message || err);
//     return res.status(500).json({ message: "Сервер дээр алдаа гарлаа. Дахин оролдоно уу." });
//   }
// };