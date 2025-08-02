import { Router } from "express";
import {
  createMessage,
  getMessages,
  chatAssistant,
  suggestMentors,
  getMentorsByQuestion,
} from "../controller/chat-create";
export const chatRouter = Router();

chatRouter.post("/createMessage", createMessage);
chatRouter.get("/getMessage", getMessages);
chatRouter.post("/chat-assistant", chatAssistant);
chatRouter.post("/suggestmentors", suggestMentors);
chatRouter.post("/mentors-by-question", getMentorsByQuestion);
