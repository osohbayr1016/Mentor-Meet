"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubCategories = void 0;
const category_model_1 = require("../model/category-model");
const mongoose_1 = __importDefault(require("mongoose"));
const addSubCategories = async (req, res) => {
    const { categoryId } = req.params;
    const { subCategory } = req.body;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "categoryId буруу байна" });
        }
        const category = await category_model_1.CategoryModel.findById(categoryId);
        const existingSubCategories = (category === null || category === void 0 ? void 0 : category.subCategory) || [];
        const uniqueSubCategories = subCategory.filter((item) => !existingSubCategories.includes(item));
        if (uniqueSubCategories.length === 0) {
            return res
                .status(409)
                .json({ message: "subCategory давхардсан эсвэл бүгд нэмэгдсэн байна" });
        }
        const result = await category_model_1.CategoryModel.updateOne({ _id: categoryId }, { $push: { subCategory: { $each: subCategory } } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "categoryId олдсонгүй" });
        }
        res
            .status(200)
            .json({ message: "SubCategory-ууд амжилттай нэмэгдлээ", result });
    }
    catch (err) {
        res.status(500).json({
            message: "SubCategory seed хийх үед алдаа гарлаа",
            error: err.message,
        });
    }
};
exports.addSubCategories = addSubCategories;
