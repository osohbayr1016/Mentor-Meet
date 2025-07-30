import { model, ObjectId, Schema } from "mongoose";


export type MessageType = {
email:string
message:string
senderType?: string
intent: "issue" | "request" | "help" | "other";
createdAt: Date;
updatedAt: Date;
}


const MessageSchema = new Schema<MessageType>({
email: { type: String, required: true },
senderType: { type: String },
  message: { type: String, required: true },
   intent: {
    type: String,
    enum: ["issue", "request", "help", "other"],
    required: true,
  },
 createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});



export const MessageModel = model<MessageType>("Message", MessageSchema);