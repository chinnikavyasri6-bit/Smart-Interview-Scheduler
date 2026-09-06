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

router.post(
  "/",
  authenticate,
  validate(createAvailabilitySchema),
  createAvailability
);

router.get(
  "/user/:userId",
  authenticate,
  getUserAvailability
);

router.get(
  "/common",
  authenticate,
  getCommonAvailability
);

module.exports = router;