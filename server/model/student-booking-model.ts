import { model, models, ObjectId, Schema } from "mongoose";

export type NotificationType = {
  _id: ObjectId;
  userId: Schema.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
  checked: boolean;
  bookingId: Schema.Types.ObjectId;
};

const NotificationSchema = new Schema<NotificationType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Mentor" },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    checked: { type: Boolean, default: false },
  },

  { timestamps: true }
);

export const NotificationModel = model<NotificationType>(
  "Notification",
  NotificationSchema
);
