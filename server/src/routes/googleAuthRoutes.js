const express = require("express");

const {
  connectGoogleCalendar,
  getGoogleAuthUrlForUser,
  googleCallback,
  getGoogleStatus
} = require("../controllers/googleAuthController");

const {
  authenticate
} = require("../middlewares/authMiddleware");


const router = express.Router();


/* =========================
   START GOOGLE AUTH
   Browser redirect version
========================= */

router.get(
  "/auth",
  authenticate,
  connectGoogleCalendar
);


/* =========================
   GET GOOGLE AUTH URL
   Frontend uses this endpoint
========================= */

router.get(
  "/auth-url",
  authenticate,
  getGoogleAuthUrlForUser
);


/* =========================
   GOOGLE OAUTH CALLBACK
========================= */

router.get(
  "/callback",
  googleCallback
);


/* =========================
   CHECK GOOGLE CONNECTION
========================= */

router.get(
  "/status",
  authenticate,
  getGoogleStatus
);


module.exports = router;