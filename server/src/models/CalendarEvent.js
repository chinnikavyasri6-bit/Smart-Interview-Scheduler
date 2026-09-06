const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    externalEventId: {
      type: String,
      required: true
    },

    title: {
      type: String,
      default: ""
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
      enum: ["google_calendar", "manual"],
      default: "google_calendar"
    },

    status: {
      type: String,
      enum: ["confirmed", "tentative", "cancelled"],
      default: "confirmed"
    }
  },
  {
    timestamps: true
  }
);

const CalendarEvent = mongoose.model(
  "CalendarEvent",
  calendarEventSchema
);

module.exports = CalendarEvent;