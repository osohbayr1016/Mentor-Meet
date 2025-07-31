import { model, ObjectId, Schema } from "mongoose";

export type MessageType = {
  email: string;
  message: string;
  senderType?: string;
  intent: "асуудал" | "хүсэлт" | "тусламж" | "бусад";
  createdAt: Date;
  updatedAt: Date;
};

const MessageSchema = new Schema<MessageType>({
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

export const MessageModel = model<MessageType>("Message", MessageSchema);
