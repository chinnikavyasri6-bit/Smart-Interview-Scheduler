const mongoose = require("mongoose");

const Availability = require("../models/Availability");
const User = require("../models/User");
const {
  findCommonAvailability
} = require("../services/availabilityService");

const createAvailability = async (req, res) => {
  try {
    const {
  start,
  end,
  timezone,
  source,
  status
} = req.body;

const user = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const userExists = await User.findById(user);

if (!userExists) {
  return res.status(404).json({
    success: false,
    message: "User not found"
  });
}

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time"
      });
    }

    const availability = await Availability.create({
      user,
      start: startDate,
      end: endDate,
      timezone,
      source,
      status
    });

    const populatedAvailability =
      await Availability.findById(
        availability._id
      ).populate(
        "user",
        "name email role timezone"
      );

    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: populatedAvailability
    });
  } catch (error) {
    console.error(
      "Create availability error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create availability",
      error: error.message
    });
  }
};

const getUserAvailability = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const availability = await Availability.find({
      user: userId
    }).sort({ start: 1 });

    res.status(200).json({
      success: true,
      count: availability.length,
      data: availability
    });
  } catch (error) {
    console.error(
      "Get availability error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
      error: error.message
    });
  }
};

const getCommonAvailability = async (req, res) => {
  try {
    const {
      userIds,
      start,
      end
    } = req.query;

    if (!userIds) {
      return res.status(400).json({
        success: false,
        message: "userIds query parameter is required"
      });
    }

    const users = userIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (users.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least two users are required"
      });
    }

    const invalidId = users.find(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidId) {
      return res.status(400).json({
        success: false,
        message: "One or more user IDs are invalid"
      });
    }

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: "start and end query parameters are required"
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

    const commonAvailability =
      await findCommonAvailability({
        userIds: users,
        rangeStart,
        rangeEnd
      });

    res.status(200).json({
      success: true,
      count: commonAvailability.length,
      data: commonAvailability
    });
  } catch (error) {
    console.error(
      "Get common availability error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to find common availability",
      error: error.message
    });
  }
};

module.exports = {
  createAvailability,
  getUserAvailability,
  getCommonAvailability
};