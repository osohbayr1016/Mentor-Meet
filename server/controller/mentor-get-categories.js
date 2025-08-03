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
exports.getCategories = void 0;
const category_model_1 = require("../model/category-model");
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.CategoryModel.find({});
        if (!categories || categories.length === 0) {
            return res.status(404).send({ message: "Ангилал олдсонгүй." });
        }
        return res.status(200).send({ categories });
    }
    catch (error) {
        console.error("Get categories error:", error.message);
        return res.status(500).json({ message: "Сервер дээр алдаа гарлаа." });
    }
});
exports.getCategories = getCategories;
