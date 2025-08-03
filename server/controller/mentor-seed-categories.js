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
exports.seedCategories = void 0;
const category_model_1 = require("../model/category-model");
const seedCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const results = yield Promise.all(categories.map((name) => __awaiter(void 0, void 0, void 0, function* () {
            const exists = yield category_model_1.CategoryModel.findOne({ categoryName: name });
            if (!exists) {
                return yield new category_model_1.CategoryModel({ categoryName: name }).save();
            }
            return null;
        })));
        res.status(201).json({ message: "Бүх ангилал нэмэгдлээ", created: results.filter(Boolean) });
    }
    catch (err) {
        res.status(500).json({ message: "Seed хийх үед алдаа гарлаа", error: err.message });
    }
});
exports.seedCategories = seedCategories;
