"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const chat_create_1 = require("../controller/chat-create");
exports.chatRouter = (0, express_1.Router)();
exports.chatRouter.post("/createMessage", chat_create_1.createMessage);
exports.chatRouter.get("/getMessage", chat_create_1.getMessages);
