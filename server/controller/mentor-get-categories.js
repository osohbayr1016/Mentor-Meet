"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = void 0;
const category_model_1 = require("../model/category-model");
const getCategories = async (req, res) => {
    try {
        const categories = await category_model_1.CategoryModel.find({});
        if (!categories || categories.length === 0) {
            return res.status(404).send({ message: "Ангилал олдсонгүй." });
        }
        return res.status(200).send({ categories });
    }
    catch (error) {
        console.error("Get categories error:", error.message);
        return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
    }
};
exports.getCategories = getCategories;
