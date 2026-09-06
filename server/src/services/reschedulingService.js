const Interview = require("../models/Interview");
const CalendarEvent = require("../models/CalendarEvent");

const {
  hasConflict
} = require("../../../scheduler/conflictDetector");

const rescheduleInterview = async ({
  interviewId,
  start,
  end
}) => {

  // 1. Find interview
  const interview = await Interview.findById(
    interviewId
  );

  if (!interview) {
    const error = new Error(
      "Interview not found"
    );

    error.statusCode = 404;
    throw error;
  }

  // 2. Make sure interview can be rescheduled
  if (
    interview.status !== "confirmed" &&
    interview.status !== "rescheduling"
  ) {
    const error = new Error(
      "Only confirmed interviews can be rescheduled"
    );

    error.statusCode = 400;
    throw error;
  }

  // 3. Validate dates
  const newStart = new Date(start);
  const newEnd = new Date(end);

  if (
    Number.isNaN(newStart.getTime()) ||
    Number.isNaN(newEnd.getTime())
  ) {
    const error = new Error(
      "Invalid start or end date"
    );

    error.statusCode = 400;
    throw error;
  }

  if (newEnd <= newStart) {
    const error = new Error(
      "End time must be after start time"
    );

    error.statusCode = 400;
    throw error;
  }

  // 4. Check interview duration
  const durationInMinutes =
    (newEnd.getTime() -
      newStart.getTime()) /
    (1000 * 60);

  if (
    durationInMinutes !== interview.duration
  ) {
    const error = new Error(
      `Interview must be exactly ${interview.duration} minutes`
    );

    error.statusCode = 400;
    throw error;
  }

  // 5. Participants
  const participantIds = [
    interview.candidate,
    interview.recruiter,
    ...interview.interviewers
  ];

  // 6. Find calendar conflicts
  const calendarEvents =
    await CalendarEvent.find({
      user: {
        $in: participantIds
      },

      status: {
        $ne: "cancelled"
      },

      start: {
        $lt: newEnd
      },

      end: {
        $gt: newStart
      }
    });

  // Ignore the existing events belonging
  // to this interview's current slot.
  const otherEvents = calendarEvents.filter(
    (event) => {
      return !event.externalEventId.startsWith(
        `internal-${interview._id}-`
      );
    }
  );

  const conflictExists = hasConflict(
    {
      start: newStart,
      end: newEnd
    },
    otherEvents
  );

  if (conflictExists) {
    const error = new Error(
      "New slot is not available because of a calendar conflict"
    );

    error.statusCode = 409;
    throw error;
  }

  // 7. Cancel old calendar events
  await CalendarEvent.updateMany(
    {
      externalEventId: {
        $regex:
          `^internal-${interview._id}-`
      }
    },
    {
      $set: {
        status: "cancelled"
      }
    }
  );

  // 8. Update interview
  interview.selectedSlot = {
    start: newStart,
    end: newEnd
  };

  interview.status = "confirmed";

  await interview.save();

  // 9. Create new calendar events
  const events = [];

  for (const userId of participantIds) {

    const event =
      await CalendarEvent.create({
        user: userId,

        externalEventId:
          `internal-${interview._id}-${userId}-${Date.now()}`,

        title: interview.title,

        start: newStart,

        end: newEnd,

        timezone: interview.timezone,

        source: "manual",

        status: "confirmed"
      });

    events.push(event);
  }

  return {
    interview,
    calendarEvents: events
  };
};

module.exports = {
  rescheduleInterview
};