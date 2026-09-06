const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      default: null
    },

    action: {
      type: String,
      enum: [
        "interview_created",
        "availability_added",
        "availability_updated",
        "slot_generated",
        "slot_proposed",
        "slot_confirmed",
        "interview_rescheduled",
        "interview_cancelled",
        "calendar_event_created",
        "notification_sent"
      ],
      required: true
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

const AuditLog = mongoose.model(
  "AuditLog",
  auditLogSchema
);

module.exports = AuditLog;