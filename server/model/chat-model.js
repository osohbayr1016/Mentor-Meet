"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    senderType: { type: String },
    message: { type: String, required: true },
    intent: {
        type: String,
        enum: ["асуудал", "хүсэлт", "тусламж", "бусад"],
        required: true,
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
});
exports.MessageModel = (0, mongoose_1.model)("Message", MessageSchema);
