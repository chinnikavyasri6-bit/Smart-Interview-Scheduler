const mongoose = require("mongoose");

const Interview = require("../models/Interview");
const CalendarEvent = require("../models/CalendarEvent");

const {
  hasConflict
} = require("../../../scheduler/conflictDetector");


const confirmInterviewSlot = async ({
  interviewId,
  start,
  end
}) => {

  // 1. Find the interview
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


  // 2. Convert selected slot to dates
  const selectedStart = new Date(start);
  const selectedEnd = new Date(end);


  // 3. Validate dates
  if (
    Number.isNaN(selectedStart.getTime()) ||
    Number.isNaN(selectedEnd.getTime())
  ) {
    const error = new Error(
      "Invalid start or end date"
    );

    error.statusCode = 400;
    throw error;
  }


  // 4. Validate duration
  const durationInMinutes =
    (selectedEnd.getTime() -
      selectedStart.getTime()) /
    (1000 * 60);


  if (durationInMinutes !== interview.duration) {
    const error = new Error(
      `Selected slot must be exactly ${interview.duration} minutes`
    );

    error.statusCode = 400;
    throw error;
  }


  // 5. Get all participants
  const participantIds = [
    interview.candidate,
    ...interview.interviewers
  ];


  // 6. Check existing calendar events
  const calendarEvents =
    await CalendarEvent.find({
      user: {
        $in: participantIds
      },

      status: {
        $ne: "cancelled"
      },

      start: {
        $lt: selectedEnd
      },

      end: {
        $gt: selectedStart
      }
    });


  // 7. Check for conflicts
  const conflictExists = hasConflict(
    {
      start: selectedStart,
      end: selectedEnd
    },
    calendarEvents
  );


  if (conflictExists) {
    const error = new Error(
      "Selected slot is no longer available because of a calendar conflict"
    );

    error.statusCode = 409;
    throw error;
  }


  // 8. Save selected slot
  interview.selectedSlot = {
    start: selectedStart,
    end: selectedEnd
  };

  interview.status = "confirmed";

  await interview.save();


  // 9. Return populated interview
  const populatedInterview =
    await Interview.findById(
      interview._id
    )
      .populate(
        "candidate",
        "name email role timezone"
      )
      .populate(
        "recruiter",
        "name email role timezone"
      )
      .populate(
        "interviewers",
        "name email role timezone"
      );


  return populatedInterview;
};


module.exports = {
  confirmInterviewSlot
};