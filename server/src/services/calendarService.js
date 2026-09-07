const CalendarEvent = require("../models/CalendarEvent");
const {
  createGoogleCalendarEvent
} = require("./googleCalendarService");

const createInterviewCalendarEvents = async ({
  interview,
  meetingLink = null
}) => {
  /*
   * The recruiter is the Google Calendar organizer.
   * One real Google Calendar event is created with
   * candidate + interviewers as attendees.
   */

  const recruiter = interview.recruiter;

  if (!recruiter) {
    throw new Error("Recruiter information is required");
  }

  const googleEvent =
    await createGoogleCalendarEvent({
      interview,
      recruiter
    });

  const finalMeetingLink =
    googleEvent.meetingLink || meetingLink;

  const participants = [
    interview.candidate,
    recruiter,
    ...(interview.interviewers || [])
  ];

  const calendarEvents = [];

  for (const participant of participants) {
    if (!participant?._id) {
      continue;
    }

    const existingEvent =
      await CalendarEvent.findOne({
        user: participant._id,
        externalEventId: googleEvent.eventId
      });

    if (existingEvent) {
      calendarEvents.push(existingEvent);
      continue;
    }

    const calendarEvent =
      await CalendarEvent.create({
        user: participant._id,

        externalEventId:
          googleEvent.eventId,

        title: interview.title,

        start: interview.selectedSlot.start,

        end: interview.selectedSlot.end,

        timezone: interview.timezone,

        source: "google_calendar",

        status: "confirmed"
      });

    calendarEvents.push(calendarEvent);
  }

  return {
    calendarEvents,
    googleEvent,
    meetingLink: finalMeetingLink
  };
};

module.exports = {
  createInterviewCalendarEvents
};