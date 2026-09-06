const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    interviewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    duration: {
      type: Number,
      required: true,
      min: 15
    },

    interviewType: {
      type: String,
      enum: ["technical", "hr", "managerial", "behavioral", "other"],
      default: "technical"
    },

    status: {
      type: String,
      enum: [
        "draft",
        "scheduling",
        "proposed",
        "confirmed",
        "completed",
        "cancelled",
        "rescheduling"
      ],
      default: "draft"
    },

    timezone: {
      type: String,
      required: true,
      default: "UTC"
    },

    selectedSlot: {
      start: {
        type: Date
      },

      end: {
        type: Date
      }
    },

    meetingLink: {
      type: String,
      default: null
    },

    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;