"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubCategories = void 0;
const category_model_1 = require("../model/category-model");
const addSubCategories = async (req, res) => {
    const { categoryId } = req.params;
    const { subCategory } = req.body;
    try {
        const result = await category_model_1.CategoryModel.updateOne({ _id: categoryId }, { $push: { subCategory: { $each: subCategory } } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "categoryId олдсонгүй" });
        }
        res.status(200).json({ message: "SubCategory-ууд амжилттай нэмэгдлээ", result });
    }
    catch (err) {
        res.status(500).json({ message: "SubCategory seed хийх үед алдаа гарлаа", error: err.message });
    }
};
exports.addSubCategories = addSubCategories;
