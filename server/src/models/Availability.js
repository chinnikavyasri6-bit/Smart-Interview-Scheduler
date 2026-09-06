const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    timezone: {
      type: String,
      required: true
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    source: {
      type: String,
      enum: ["manual", "calendar"],
      default: "manual"
    }
  },
  {
    timestamps: true
  }
);

const Availability = mongoose.model(
  "Availability",
  availabilitySchema
);

module.exports = Availability;