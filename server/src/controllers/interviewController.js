const mongoose = require("mongoose");

const Interview = require("../models/Interview");
const User = require("../models/User");
const {
  generateInterviewSchedule
} = require("../services/schedulingService");

const createInterview = async (req, res) => {
  try {
    const {
      title,
      candidate,
      recruiter,
      interviewers,
      duration,
      interviewType,
      timezone,
      notes
    } = req.body;

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
    const interviews = await Interview.find()
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

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  scheduleInterview
};