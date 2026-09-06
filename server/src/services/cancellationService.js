const Interview = require("../models/Interview");
const CalendarEvent = require("../models/CalendarEvent");

const cancelInterview = async ({
  interviewId
}) => {

  const interview =
    await Interview.findById(interviewId);

  if (!interview) {
    const error =
      new Error("Interview not found");

    error.statusCode = 404;
    throw error;
  }

  if (interview.status === "cancelled") {
    const error =
      new Error("Interview is already cancelled");

    error.statusCode = 400;
    throw error;
  }

  if (interview.status === "completed") {
    const error =
      new Error(
        "Completed interviews cannot be cancelled"
      );

    error.statusCode = 400;
    throw error;
  }

  // Cancel all calendar events
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

  // Update interview
  interview.status = "cancelled";

  await interview.save();

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
  cancelInterview
};