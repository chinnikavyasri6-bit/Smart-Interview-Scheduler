const mongoose = require("mongoose");

const Interview = require("../models/Interview");
const User = require("../models/User");
const {
  generateInterviewSchedule
} = require("../services/schedulingService");

const {
  createInterviewCalendarEvents
} = require("../services/calendarService");

const {
  confirmInterviewSlot
} = require("../services/confirmationService");

const {
  createInterviewNotifications,
  createInterviewCancellationNotifications
} = require("../services/notificationService");

const {
  createInterviewConfirmationAuditLogs,
  createRescheduleAuditLog,
  createCancellationAuditLog
} = require("../services/auditService");

const {
  rescheduleInterview
} = require("../services/reschedulingService");

const {
  cancelInterview
} = require("../services/cancellationService");

const {
  sendInterviewConfirmationEmail
} = require("../services/emailService");

const createInterview = async (req, res) => {
  try {
    const {
  title,
  candidate,
  interviewers,
  duration,
  interviewType,
  timezone,
  notes
} = req.body;

const recruiter = req.user.userId;

    // Validate MongoDB IDs
    const allIds = [
      candidate,
      recruiter,
      ...interviewers
    ];

    const invalidId = allIds.find(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidId) {
      return res.status(400).json({
        success: false,
        message: "One or more user IDs are invalid"
      });
    }

    // Verify candidate and recruiter
    const candidateUser = await User.findOne({
      _id: candidate,
      role: "candidate"
    });

    const recruiterUser = await User.findOne({
      _id: recruiter,
      role: "recruiter"
    });

    // Verify interviewers
    const interviewerUsers = await User.find({
      _id: { $in: interviewers },
      role: "interviewer"
    });

    if (!candidateUser) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    if (!recruiterUser) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found"
      });
    }

    if (interviewerUsers.length !== interviewers.length) {
      return res.status(404).json({
        success: false,
        message: "One or more interviewers not found"
      });
    }

    const interview = await Interview.create({
      title,
      candidate,
      recruiter,
      interviewers,
      duration,
      interviewType,
      timezone,
      notes,
      status: "scheduling"
    });

    const populatedInterview = await Interview.findById(
      interview._id
    )
      .populate("candidate", "name email role timezone")
      .populate("recruiter", "name email role timezone")
      .populate("interviewers", "name email role timezone");

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      data: populatedInterview
    });
  } catch (error) {
    console.error(
      "Create interview error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create interview",
      error: error.message
    });
  }
};

const getInterviews = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    let filter = {};

    if (currentUserRole === "recruiter") {
      filter.recruiter = currentUserId;
    } else if (currentUserRole === "candidate") {
      filter.candidate = currentUserId;
    } else if (currentUserRole === "interviewer") {
      filter.interviewers = currentUserId;
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid user role"
      });
    }

    const interviews = await Interview.find(filter)
      .populate("candidate", "name email role timezone")
      .populate("recruiter", "name email role timezone")
      .populate("interviewers", "name email role timezone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    console.error(
      "Get interviews error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
      error: error.message
    });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID"
      });
    }

    const interview = await Interview.findById(id)
      .populate("candidate", "name email role timezone")
      .populate("recruiter", "name email role timezone")
      .populate("interviewers", "name email role timezone");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    let hasAccess = false;

    if (currentUserRole === "recruiter") {
      hasAccess =
        interview.recruiter._id.toString() === currentUserId;
    }

    if (currentUserRole === "candidate") {
      hasAccess =
        interview.candidate._id.toString() === currentUserId;
    }

    if (currentUserRole === "interviewer") {
      hasAccess = interview.interviewers.some(
        (interviewer) =>
          interviewer._id.toString() === currentUserId
      );
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this interview"
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error(
      "Get interview error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch interview",
      error: error.message
    });
  }
};

const scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID"
      });
    }

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: "start and end are required"
      });
    }

    const rangeStart = new Date(start);
    const rangeEnd = new Date(end);

    if (
      Number.isNaN(rangeStart.getTime()) ||
      Number.isNaN(rangeEnd.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid start or end date"
      });
    }

    if (rangeEnd <= rangeStart) {
      return res.status(400).json({
        success: false,
        message: "end must be after start"
      });
    }

    const schedule =
      await generateInterviewSchedule({
        interviewId: id,
        rangeStart,
        rangeEnd
      });

    res.status(200).json({
      success: true,
      message: "Interview schedule generated successfully",
      data: schedule
    });

  } catch (error) {

    console.error(
      "Schedule interview error:",
      error.message
    );

    res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : "Failed to generate interview schedule",
      error: error.statusCode
        ? undefined
        : error.message
    });
  }
};

const confirmInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID"
      });
    }

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: "start and end are required"
      });
    }

    const selectedStart = new Date(start);
    const selectedEnd = new Date(end);

    if (
      Number.isNaN(selectedStart.getTime()) ||
      Number.isNaN(selectedEnd.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid start or end date"
      });
    }

    if (selectedEnd <= selectedStart) {
      return res.status(400).json({
        success: false,
        message: "end must be after start"
      });
    }

    /*
     * Load interview first so we can verify
     * that the logged-in user is allowed to confirm it.
     */
    const interviewBeforeConfirmation =
      await Interview.findById(id)
        .populate("candidate", "name email role")
        .populate("recruiter", "name email role")
        .populate("interviewers", "name email role");

    if (!interviewBeforeConfirmation) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    const currentUserId =
      req.user.userId.toString();

    const isRecruiter =
      interviewBeforeConfirmation.recruiter?._id
        ?.toString() === currentUserId;

    const isCandidate =
      interviewBeforeConfirmation.candidate?._id
        ?.toString() === currentUserId;

    const isInterviewer =
      interviewBeforeConfirmation.interviewers?.some(
        (interviewer) =>
          interviewer._id.toString() === currentUserId
      );

    if (
      !isRecruiter &&
      !isCandidate &&
      !isInterviewer
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to confirm this interview"
      });
    }

    /*
     * Confirm slot using existing scheduling logic.
     */
    const interview =
      await confirmInterviewSlot({
        interviewId: id,
        start,
        end
      });

    /*
     * Populate again because confirmation may
     * return a fresh document.
     */
    await interview.populate([
      {
        path: "candidate",
        select: "name email role"
      },
      {
        path: "recruiter",
        select: "name email role"
      },
      {
        path: "interviewers",
        select: "name email role"
      }
    ]);

    /*
     * Create Google Calendar event + Google Meet.
     */
    const calendarResult =
      await createInterviewCalendarEvents({
        interview
      });

    const meetingLink =
      calendarResult.meetingLink;

    /*
     * Save Google information on interview.
     */
    interview.meetingLink =
      meetingLink;

    interview.googleCalendarEventId =
      calendarResult.googleEvent.eventId;

    interview.googleCalendarHtmlLink =
      calendarResult.googleEvent.htmlLink;

    await interview.save();

    const emailResults = [];

const recipients = [
  interview.candidate?.email,
  ...(interview.interviewers || []).map(
    (interviewer) => interviewer.email
  )
].filter(Boolean);

for (const recipient of recipients) {
  try {
    const emailResult =
      await sendInterviewConfirmationEmail({
        recipient,
        interview,
        meetingLink
      });

    emailResults.push({
      recipient,
      success: true,
      id: emailResult?.id || null
    });
  } catch (emailError) {
    console.error(
      `Email failed for ${recipient}:`,
      emailError.message
    );

    emailResults.push({
      recipient,
      success: false,
      error: emailError.message
    });
  }
}

    /*
     * Create system notifications.
     */
    const notifications =
      await createInterviewNotifications({
        interview
      });

    /*
     * Create audit logs.
     */
    const auditLogs =
      await createInterviewConfirmationAuditLogs({
        interview,
        confirmedBy: currentUserId
      });

    res.status(200).json({
  success: true,
  message: "Interview confirmed successfully",
  data: {
    interview,
    meetingLink,
    googleCalendar: {
      eventId: calendarResult.googleEvent.eventId,
      htmlLink: calendarResult.googleEvent.htmlLink
    },
    calendarEvents: calendarResult.calendarEvents,
    notifications,
    emails: emailResults,
    auditLogs
  }
});
  } catch (error) {
    console.error(
      "Confirm interview error:",
      error.message
    );

    res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : "Failed to confirm interview slot"
    });
  }
};

const rescheduleInterviewController =
  async (req, res) => {

    try {

      const { id } = req.params;
      const { start, end } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid interview ID"
        });
      }

      if (!start || !end) {
        return res.status(400).json({
          success: false,
          message:
            "start and end are required"
        });
      }

      const result =
        await rescheduleInterview({
          interviewId: id,
          start,
          end
        });

      const notifications =
        await createInterviewNotifications({
          interview: result.interview
        });

      const auditLog =
        await createRescheduleAuditLog({
          interview: result.interview,
          confirmedBy:
            result.interview.recruiter._id ||
            result.interview.recruiter,
          start: result.interview.selectedSlot.start,
          end: result.interview.selectedSlot.end
        });

      res.status(200).json({
        success: true,
        message:
          "Interview rescheduled successfully",
        data: {
          interview: result.interview,
          calendarEvents:
            result.calendarEvents,
          notifications,
          auditLog
        }
      });

    } catch (error) {

      console.error(
        "Reschedule interview error:",
        error.message
      );

      res.status(
        error.statusCode || 500
      ).json({
        success: false,
        message:
          error.statusCode
            ? error.message
            : "Failed to reschedule interview",
        error:
          error.statusCode
            ? undefined
            : error.message
      });
    }
  };

  const cancelInterviewController =
  async (req, res) => {

    try {

      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid interview ID"
        });
      }

      const interview =
        await cancelInterview({
          interviewId: id
        });

      const notifications =
        await createInterviewCancellationNotifications({
          interview
        });

      const auditLog =
        await createCancellationAuditLog({
          interview,
          cancelledBy:
            interview.recruiter._id ||
            interview.recruiter
        });

      res.status(200).json({
        success: true,
        message:
          "Interview cancelled successfully",
        data: {
          interview,
          notifications,
          auditLog
        }
      });

    } catch (error) {

      console.error(
        "Cancel interview error:",
        error.message
      );

      res.status(
        error.statusCode || 500
      ).json({
        success: false,
        message:
          error.statusCode
            ? error.message
            : "Failed to cancel interview",
        error:
          error.statusCode
            ? undefined
            : error.message
      });
    }
  };

  const getInterviewSlots = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found"
      });
    }

    // Only the candidate assigned to this interview
    // can view the proposed slots.
    if (
      req.user.role === "candidate" &&
      interview.candidate.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view these slots"
      });
    }

    // Recruiter can also view the slots.
    if (
      req.user.role === "interviewer" &&
      !interview.interviewers.some(
        (interviewerId) =>
          interviewerId.toString() === req.user.userId
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view these slots"
      });
    }

    if (
      interview.status !== "scheduling" &&
      interview.status !== "proposed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Interview is not currently being scheduled"
      });
    }

    const rangeStart = req.query.start
      ? new Date(req.query.start)
      : new Date();

    const rangeEnd = req.query.end
      ? new Date(req.query.end)
      : new Date(
          rangeStart.getTime() + 7 * 24 * 60 * 60 * 1000
        );

    if (
      Number.isNaN(rangeStart.getTime()) ||
      Number.isNaN(rangeEnd.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduling date range"
      });
    }

    const result = await generateInterviewSchedule({
      interviewId: id,
      rangeStart,
      rangeEnd
    });

    return res.status(200).json({
      success: true,
      data: {
        interview: result.interview,
        commonAvailability: result.commonAvailability,
        generatedSlots: result.generatedSlots,
        validSlots: result.validSlots,
        rankedSlots: result.rankedSlots
      }
    });
  } catch (error) {
    console.error("Get interview slots error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to generate interview slots"
    });
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  scheduleInterview,
  confirmInterview,
  rescheduleInterviewController,
  cancelInterviewController,
  getInterviewSlots
};