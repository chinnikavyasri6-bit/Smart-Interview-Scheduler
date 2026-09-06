const Notification = require("../models/Notification");

const getUserId = (user) => {
  return user?._id
    ? user._id.toString()
    : user.toString();
};

const createInterviewNotifications = async ({
  interview
}) => {
  const recipients = [
    interview.candidate,
    interview.recruiter,
    ...interview.interviewers
  ];

  const uniqueRecipients = [
    ...new Set(
      recipients.map(getUserId)
    )
  ];

  const notifications = [];

  for (const recipient of uniqueRecipients) {
    const notification =
      await Notification.create({
        recipient,

        interview: interview._id,

        type: "confirmation",

        channel: "system",

        subject:
          `Interview Confirmed: ${interview.title}`,

        message:
          `Your interview has been confirmed for ${interview.selectedSlot.start.toISOString()} to ${interview.selectedSlot.end.toISOString()}.`,

        status: "sent",

        sentAt: new Date()
      });

    notifications.push(notification);
  }

  return notifications;
};

const createInterviewCancellationNotifications =
  async ({ interview }) => {

    const recipients = [
      interview.candidate,
      interview.recruiter,
      ...interview.interviewers
    ];

    const uniqueRecipients = [
      ...new Set(
        recipients.map(getUserId)
      )
    ];

    const notifications = [];

    for (const recipient of uniqueRecipients) {
      const notification =
        await Notification.create({
          recipient,
          interview: interview._id,
          type: "cancellation",
          channel: "system",
          subject:
            `Interview Cancelled: ${interview.title}`,
          message:
            `Your interview "${interview.title}" has been cancelled.`,
          status: "sent",
          sentAt: new Date()
        });

      notifications.push(notification);
    }

    return notifications;
  };

module.exports = {
  createInterviewNotifications,
  createInterviewCancellationNotifications
};