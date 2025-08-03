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
exports.createCategory = void 0;
const category_model_1 = require("../model/category-model");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName } = req.body;
    if (!categoryName || typeof categoryName !== "string") {
        return res.status(400).json({ message: "categoryName талбарыг зөв оруулна уу." });
    }
    try {
        const existingCategory = yield category_model_1.CategoryModel.findOne({ categoryName });
        if (existingCategory) {
            return res.status(409).json({ message: "Ангилал аль хэдийн бүртгэлтэй байна." });
        }
        const newCategory = yield category_model_1.CategoryModel.create({ categoryName });
        return res.status(201).json({
            message: "Ангилал амжилттай нэмэгдлээ.",
            category: newCategory,
        });
    }
    catch (error) {
        console.error("Алдаа:", error.message || error);
        return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
    }
});
exports.createCategory = createCategory;
