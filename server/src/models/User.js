const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter", "interviewer"],
      required: true
    },

    timezone: {
      type: String,
      required: true,
      default: "UTC"
    },

    workingHours: {
      start: {
        type: String,
        default: "09:00"
      },

      end: {
        type: String,
        default: "17:00"
      }
    },

    googleCalendarConnected: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;