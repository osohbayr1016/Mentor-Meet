"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = void 0;
const category_model_1 = require("../model/category-model");
const createCategory = async (req, res) => {
    const { categoryName } = req.body;
    if (!categoryName || typeof categoryName !== "string") {
        return res.status(400).json({ message: "categoryName талбарыг зөв оруулна уу." });
    }
    try {
        const existingCategory = await category_model_1.CategoryModel.findOne({ categoryName });
        if (existingCategory) {
            return res.status(409).json({ message: "Ангилал аль хэдийн бүртгэлтэй байна." });
        }
        const newCategory = await category_model_1.CategoryModel.create({ categoryName });
        return res.status(201).json({
            message: "Ангилал амжилттай нэмэгдлээ.",
            category: newCategory,
        });
    }
    catch (error) {
        console.error("Алдаа:", error.message || error);
        return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
    }
};
exports.createCategory = createCategory;
