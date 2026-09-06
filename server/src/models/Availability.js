const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    start: {
      type: Date,
      required: true
    },

    end: {
      type: Date,
      required: true
    },

    timezone: {
      type: String,
      required: true
    },

    source: {
      type: String,
      enum: ["manual", "calendar"],
      default: "manual"
    },

    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
);

availabilitySchema.index({
  user: 1,
  start: 1,
  end: 1
});

module.exports = mongoose.model(
  "Availability",
  availabilitySchema
);