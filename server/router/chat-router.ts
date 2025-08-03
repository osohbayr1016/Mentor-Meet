import { Router } from "express";
import { createMessage, getMessages } from "../controller/chat-create";
import { creatMessage } from "../controller/chat";

export const chatRouter = Router();

chatRouter.post("/createMessage", createMessage);
chatRouter.get("/getMessage", getMessages);
chatRouter.post("/create", creatMessage);
