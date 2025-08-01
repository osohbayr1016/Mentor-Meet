"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const category = new mongoose_1.Schema({
    categoryName: { type: String, required: true },
    subCategory: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.CategoryModel = (0, mongoose_1.model)("Categories", category);
