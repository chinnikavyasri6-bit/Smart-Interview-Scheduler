const express = require("express");

const {
  createInterview,
  getInterviews,
  getInterviewById,
  scheduleInterview,
  confirmInterview,
  rescheduleInterviewController,
  cancelInterviewController
} = require("../controllers/interviewController");

const validate = require("../middlewares/validate");

const {
  createInterviewSchema
} = require("../validators/interviewValidator");

const {
  authenticate,
  authorizeRoles
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Create interview - recruiter only
router.post(
  "/",
  authenticate,
  authorizeRoles("recruiter"),
  validate(createInterviewSchema),
  createInterview
);

// Get interviews - authenticated users
router.get(
  "/",
  authenticate,
  getInterviews
);

// Generate schedule - recruiter only
router.post(
  "/:id/schedule",
  authenticate,
  authorizeRoles("recruiter"),
  scheduleInterview
);

// Confirm slot - recruiter only
router.post(
  "/:id/confirm",
  authenticate,
  authorizeRoles("recruiter"),
  confirmInterview
);

// Reschedule - recruiter only
router.post(
  "/:id/reschedule",
  authenticate,
  authorizeRoles("recruiter"),
  rescheduleInterviewController
);

// Cancel - recruiter only
router.post(
  "/:id/cancel",
  authenticate,
  authorizeRoles("recruiter"),
  cancelInterviewController
);

// Get single interview - authenticated users
router.get(
  "/:id",
  authenticate,
  getInterviewById
);

module.exports = router;