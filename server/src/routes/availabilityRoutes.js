const express = require("express");

const {
  createAvailability,
  getUserAvailability,
  getCommonAvailability
} = require("../controllers/availabilityController");

const validate = require("../middlewares/validate");

const {
  createAvailabilitySchema
} = require("../validators/availabilityValidator");

const {
  authenticate
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Add availability - authenticated users
router.post(
  "/",
  authenticate,
  validate(createAvailabilitySchema),
  createAvailability
);

// Find common availability - authenticated users
router.get(
  "/common",
  authenticate,
  getCommonAvailability
);

// Get a user's availability - authenticated users
router.get(
  "/user/:userId",
  authenticate,
  getUserAvailability
);

module.exports = router;