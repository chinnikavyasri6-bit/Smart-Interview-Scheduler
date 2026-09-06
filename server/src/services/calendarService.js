const CalendarEvent = require("../models/CalendarEvent");

const createInterviewCalendarEvents = async ({
  interview,
  meetingLink
}) => {
  const participantIds = [
    interview.candidate,
    interview.recruiter,
    ...interview.interviewers
  ];

  const events = [];

  for (const userId of participantIds) {
    const event = await CalendarEvent.create({
      user: userId,

      externalEventId:
        `internal-${interview._id}-${userId}`,

      title: interview.title,

      start: interview.selectedSlot.start,

      end: interview.selectedSlot.end,

      timezone: interview.timezone,

      source: "manual",

      status: "confirmed"
    });

    events.push(event);
  }

  interview.meetingLink = meetingLink;

  await interview.save();

  return events;
};

module.exports = {
  createInterviewCalendarEvents
};