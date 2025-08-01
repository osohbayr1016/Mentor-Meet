"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = void 0;
const category_model_1 = require("../model/category-model");
const seedCategories = async (req, res) => {
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
        const results = await Promise.all(categories.map(async (name) => {
            const exists = await category_model_1.CategoryModel.findOne({ categoryName: name });
            if (!exists) {
                return await new category_model_1.CategoryModel({ categoryName: name }).save();
            }
            return null;
        }));
        res.status(201).json({ message: "Бүх ангилал нэмэгдлээ", created: results.filter(Boolean) });
    }
    catch (err) {
        res.status(500).json({ message: "Seed хийх үед алдаа гарлаа", error: err.message });
    }
};
exports.seedCategories = seedCategories;
