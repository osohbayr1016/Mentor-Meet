import { Router } from "express";
import { createMessage, getMessages } from "../controller/chat-create";
export const chatRouter = Router();

chatRouter.post("/createMessage", createMessage);
chatRouter.get("/getMessage", getMessages);
