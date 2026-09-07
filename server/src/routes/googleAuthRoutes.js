const express = require("express");

const {
  connectGoogleCalendar,
  googleCallback,
  getGoogleStatus
} = require("../controllers/googleAuthController");

const {
  authenticate
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/auth",
  authenticate,
  connectGoogleCalendar
);

router.get(
  "/callback",
  googleCallback
);

router.get(
  "/status",
  authenticate,
  getGoogleStatus
);

module.exports = router;