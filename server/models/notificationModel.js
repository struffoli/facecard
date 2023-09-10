import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    faceCardId: {
      type: String,
      required: true,
    },
    otherUserId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
