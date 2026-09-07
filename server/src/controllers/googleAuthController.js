const jwt = require("jsonwebtoken");
const User = require("../models/User");

const {
  getGoogleAuthUrl,
  exchangeCodeForTokens
} = require("../services/googleCalendarService");


/* =========================
   START GOOGLE CALENDAR CONNECTION
========================= */

const connectGoogleCalendar = async (req, res) => {
  try {
    const userId = req.user.userId;

    const state = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m"
      }
    );

    const oauthUrl = getGoogleAuthUrl(state);

    res.redirect(oauthUrl);

  } catch (error) {

    console.error(
      "Google authorization error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to start Google Calendar connection"
    });
  }
};


/* =========================
   GET GOOGLE AUTH URL
   Used by frontend
========================= */

const getGoogleAuthUrlForUser = async (req, res) => {
  try {

    const userId = req.user.userId;

    const state = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m"
      }
    );

    const oauthUrl =
      getGoogleAuthUrl(state);

    res.status(200).json({
      success: true,
      url: oauthUrl
    });

  } catch (error) {

    console.error(
      "Google auth URL error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate Google authorization URL"
    });
  }
};


/* =========================
   GOOGLE CALLBACK
========================= */

const googleCallback = async (req, res) => {

  try {

    const {
      code,
      state
    } = req.query;

    if (!code || !state) {

      return res.redirect(
        `${process.env.CLIENT_URL}?google=error`
      );
    }


    const decoded =
      jwt.verify(
        state,
        process.env.JWT_SECRET
      );

    const userId =
      decoded.userId;


    const tokens =
      await exchangeCodeForTokens(code);


    const user =
      await User.findById(userId)
        .select(
          "+googleRefreshToken " +
          "+googleAccessToken " +
          "+googleTokenExpiry"
        );


    if (!user) {

      return res.redirect(
        `${process.env.CLIENT_URL}?google=error`
      );
    }


    user.googleAccessToken =
      tokens.access_token ||
      user.googleAccessToken;


    user.googleRefreshToken =
      tokens.refresh_token ||
      user.googleRefreshToken;


    user.googleTokenExpiry =
      tokens.expiry_date ||
      user.googleTokenExpiry;


    user.googleCalendarConnected =
      true;


    await user.save();


    res.redirect(
      `${process.env.CLIENT_URL}?google=connected`
    );

  } catch (error) {

    console.error(
      "Google callback error:",
      error.message
    );

    res.redirect(
      `${process.env.CLIENT_URL}?google=error`
    );
  }
};


/* =========================
   GOOGLE CALENDAR STATUS
========================= */

const getGoogleStatus = async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.userId
      ).select(
        "googleCalendarConnected"
      );


    res.status(200).json({

      success: true,

      connected:
        user?.googleCalendarConnected ||
        false
    });

  } catch (error) {

    console.error(
      "Google status error:",
      error.message
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to check Google Calendar status"
    });
  }
};


module.exports = {

  connectGoogleCalendar,

  getGoogleAuthUrlForUser,

  googleCallback,

  getGoogleStatus

};