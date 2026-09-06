const express = require("express");

const {
  createInterview,
  getInterviews,
  getInterviewById
} = require("../controllers/interviewController");

const validate = require("../middlewares/validate");

const {
  createInterviewSchema
} = require("../validators/interviewValidator");

const router = express.Router();

router.post(
  "/",
  validate(createInterviewSchema),
  createInterview
);

router.get("/", getInterviews);

router.get("/:id", getInterviewById);

module.exports = router;