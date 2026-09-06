const Interview = require("../models/Interview");
const User = require("../models/User");
const CalendarEvent = require("../models/CalendarEvent");

const {
  findCommonAvailability
} = require("./availabilityService");

const {
  generateSlots
} = require("../../../scheduler/slotGeneration");

const {
  removeConflictingSlots
} = require("../../../scheduler/conflictDetector");

const {
  isWithinWorkingHours
} = require("../../../scheduler/workingHours");

const {
  calculateSlotScore,
  rankSlots
} = require("../../../scheduler/slotRanker");


const generateInterviewSchedule = async ({
  interviewId,
  rangeStart,
  rangeEnd
}) => {

  // 1. Get interview
  const interview = await Interview.findById(interviewId);

  if (!interview) {
    const error = new Error("Interview not found");
    error.statusCode = 404;
    throw error;
  }


  // 2. Get all interview participants
  // Candidate + interviewers
  const participantIds = [
    interview.candidate.toString(),
    ...interview.interviewers.map(
      (id) => id.toString()
    )
  ];

  const participants = await User.find({
    _id: { $in: participantIds }
  });


  if (participants.length !== participantIds.length) {
    const error = new Error(
      "One or more interview participants not found"
    );

    error.statusCode = 404;
    throw error;
  }


  // 3. Find common availability
  const commonAvailability =
    await findCommonAvailability({
      userIds: participantIds,
      rangeStart,
      rangeEnd
    });


  if (commonAvailability.length === 0) {
    return {
      interview,
      commonAvailability: [],
      generatedSlots: [],
      validSlots: [],
      rankedSlots: []
    };
  }


  // 4. Generate slots based on interview duration
  let generatedSlots = [];

  for (const availability of commonAvailability) {

    const slots = generateSlots({
      start: availability.start,
      end: availability.end,
      duration: interview.duration,
      interval: 30
    });

    generatedSlots.push(...slots);
  }


  // 5. Get existing calendar events
  const calendarEvents = await CalendarEvent.find({
    user: { $in: participantIds },
    status: { $ne: "cancelled" },
    start: { $lt: rangeEnd },
    end: { $gt: rangeStart }
  });


  // 6. Remove slots having calendar conflicts
  const conflictFreeSlots =
    removeConflictingSlots(
      generatedSlots,
      calendarEvents
    );


  // 7. Check working hours for every participant
  const validSlots = conflictFreeSlots.filter(
    (slot) => {

      return participants.every(
        (participant) => {

          const startWithinWorkingHours =
            isWithinWorkingHours(
              slot.start,
              participant.timezone,
              participant.workingHours
            );

          // Check the end of the interview too.
          // Subtract one minute so an interview ending
          // exactly at 17:00 is considered valid.
          const endCheckTime =
            new Date(
              slot.end.getTime() - 60 * 1000
            );

          const endWithinWorkingHours =
            isWithinWorkingHours(
              endCheckTime,
              participant.timezone,
              participant.workingHours
            );

          return (
            startWithinWorkingHours &&
            endWithinWorkingHours
          );
        }
      );
    }
  );


  // 8. Calculate timezone comfort
  const timezones = [
    ...new Set(
      participants.map(
        (participant) => participant.timezone
      )
    )
  ];

  const timezoneComfort =
    timezones.length === 1 ? 10 : 5;


  // 9. Score every valid slot
  const scoredSlots = validSlots.map(
    (slot) => {

      const score = calculateSlotScore({
        candidatePreference: 0,
        allParticipantsAvailable: true,
        workingHoursRespected: true,
        timezoneComfort,
        workloadBalance: 0,
        operationalFit: 5
      });

      return {
        start: slot.start,
        end: slot.end,
        score
      };
    }
  );


  // 10. Rank slots
  const rankedSlots = rankSlots(scoredSlots);


  return {
    interview,
    commonAvailability,
    generatedSlots,
    validSlots,
    rankedSlots
  };
};


module.exports = {
  generateInterviewSchedule
};