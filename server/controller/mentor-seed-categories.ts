import { Request, Response } from "express";
import { CategoryModel } from "../model/category-model";

export const seedCategories = async (req: Request, res: Response) => {
  const categories = [
    "Программчлал ба Технологи",
    "Бизнес ба Менежмент",
    "Боловсрол ба Сургалт",
    "Эрүүл мэнд ба Анагаах ухаан",
    "Урлаг ба Дизайн",
    "Хууль ба Эрх зүй",
    "Сэргээгдэх эрчим хүч",
    "Хөдөө аж ахуй",
    "Байгаль орчин",
    "Спорт ба Фитнес",
    "Мэдээлэл ба Хэвлэл",
    "Тээвэр ба Логистик",
    "Үйлчилгээ ба Худалдаа",
    "Үйлдвэрлэл ба Технологи",
    "Барилга ба Архитектур"
  ];

  try {
    const results = await Promise.all(
      categories.map(async (name) => {
        const exists = await CategoryModel.findOne({ categoryName: name });
        if (!exists) {
          return await new CategoryModel({ categoryName: name }).save();
        }
        return null;
      })
    );

    res.status(201).json({ message: "Бүх ангилал нэмэгдлээ", created: results.filter(Boolean) });
  } catch (err: any) {
    res.status(500).json({ message: "Seed хийх үед алдаа гарлаа", error: err.message });
  }
};
