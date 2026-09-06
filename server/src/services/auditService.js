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

module.exports = {
  createAuditLog,
  createInterviewConfirmationAuditLogs
};