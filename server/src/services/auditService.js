const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  user,
  interview = null,
  action,
  details = {}
}) => {
  const auditLog = await AuditLog.create({
    user,
    interview,
    action,
    details
  });

  return auditLog;
};

const createInterviewConfirmationAuditLogs =
  async ({
    interview,
    confirmedBy
  }) => {

    const logs = [];

    logs.push(
      await createAuditLog({
        user: confirmedBy,
        interview: interview._id,
        action: "slot_confirmed",
        details: {
          start: interview.selectedSlot.start,
          end: interview.selectedSlot.end
        }
      })
    );

    logs.push(
      await createAuditLog({
        user: confirmedBy,
        interview: interview._id,
        action: "calendar_event_created",
        details: {
          meetingLink: interview.meetingLink
        }
      })
    );

    logs.push(
      await createAuditLog({
        user: confirmedBy,
        interview: interview._id,
        action: "notification_sent",
        details: {
          recipientCount:
            2 + interview.interviewers.length
        }
      })
    );

    return logs;
  };

  const createRescheduleAuditLog = async ({
  interview,
  confirmedBy,
  start,
  end
}) => {

  return createAuditLog({
    user: confirmedBy,
    interview: interview._id,
    action: "interview_rescheduled",
    details: {
      start,
      end
    }
  });
};

const createCancellationAuditLog =
  async ({
    interview,
    cancelledBy
  }) => {

    return createAuditLog({
      user: cancelledBy,
      interview: interview._id,
      action: "interview_cancelled",
      details: {
        previousSlot:
          interview.selectedSlot || null,
        cancelledAt: new Date()
      }
    });
  };

module.exports = {
  createAuditLog,
  createInterviewConfirmationAuditLogs,
  createRescheduleAuditLog,
  createCancellationAuditLog
};