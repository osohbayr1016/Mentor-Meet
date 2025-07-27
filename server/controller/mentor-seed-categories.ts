import { Request,Response } from "express";
import { CategoryModel } from "../model/category-model";

export const seedCategories = async (req: Request, res: Response) => {
  const categories = [
    "Технологи", "Боловсрол", "Эрүүл мэнд", "Бизнес", "Инженерчлэл",
    "Дизайн", "Маркетинг", "Санхүү"
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
