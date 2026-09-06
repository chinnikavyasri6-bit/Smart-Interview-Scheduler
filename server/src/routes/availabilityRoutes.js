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

const router = express.Router();

router.post(
  "/",
  validate(createAvailabilitySchema),
  createAvailability
);

router.get(
  "/common",
  getCommonAvailability
);

router.get(
  "/user/:userId",
  getUserAvailability
);

module.exports = router;