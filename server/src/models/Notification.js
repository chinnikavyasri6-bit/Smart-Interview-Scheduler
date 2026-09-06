const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true
    },

    type: {
      type: String,
      enum: [
        "invitation",
        "reminder",
        "confirmation",
        "rescheduling",
        "cancellation"
      ],
      required: true
    },

    channel: {
      type: String,
      enum: ["email", "system"],
      default: "email"
    },

    subject: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending"
    },

    sentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

module.exports = Notification;