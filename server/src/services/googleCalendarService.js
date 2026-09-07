const { google } = require("googleapis");
const crypto = require("crypto");
const User = require("../models/User");

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events"
];

const getOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

const getGoogleAuthUrl = (userId) => {
  const oauth2Client = getOAuthClient();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GOOGLE_SCOPES,
    state: userId
  });
};

const exchangeCodeForTokens = async (code) => {
  const oauth2Client = getOAuthClient();

  const { tokens } = await oauth2Client.getToken(code);

  return tokens;
};

const createGoogleCalendarEvent = async ({
  interview,
  recruiter
}) => {
  const user = await User.findById(recruiter._id).select(
    "+googleAccessToken +googleRefreshToken +googleTokenExpiry"
  );

  if (!user) {
    throw new Error("Recruiter not found");
  }

  if (!user.googleRefreshToken && !user.googleAccessToken) {
    throw new Error(
      "Recruiter has not connected Google Calendar"
    );
  }

  const oauth2Client = getOAuthClient();

  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleTokenExpiry
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client
  });

  const start = new Date(interview.selectedSlot.start);
  const end = new Date(interview.selectedSlot.end);

  const attendees = [];

  if (interview.candidate?.email) {
    attendees.push({
      email: interview.candidate.email
    });
  }

  for (const interviewer of interview.interviewers || []) {
    if (interviewer.email) {
      attendees.push({
        email: interviewer.email
      });
    }
  }

  const eventId = crypto
    .createHash("sha256")
    .update(`interview-${interview._id}`)
    .digest("hex")
    .substring(0, 32);

  const event = {
    id: eventId,

    summary: interview.title,

    description:
      `Interview scheduled by Smart Interview Scheduler.\n\n` +
      `Interview type: ${interview.interviewType}\n` +
      `Duration: ${interview.duration} minutes`,

    start: {
      dateTime: start.toISOString(),
      timeZone: interview.timezone
    },

    end: {
      dateTime: end.toISOString(),
      timeZone: interview.timezone
    },

    attendees,

    conferenceData: {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: {
          type: "hangoutsMeet"
        }
      }
    }
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: "all"
  });

  let createdEvent = response.data;

  if (
    !createdEvent.hangoutLink &&
    !createdEvent.conferenceData?.entryPoints
  ) {
    const refreshedEvent = await calendar.events.get({
      calendarId: "primary",
      eventId: createdEvent.id
    });

    createdEvent = refreshedEvent.data;
  }

  const videoEntryPoint =
    createdEvent.conferenceData?.entryPoints?.find(
      (entryPoint) =>
        entryPoint.entryPointType === "video"
    );

  const meetingLink =
    createdEvent.hangoutLink ||
    videoEntryPoint?.uri ||
    null;

  return {
    eventId: createdEvent.id,
    htmlLink: createdEvent.htmlLink,
    meetingLink,
    event: createdEvent
  };
};

module.exports = {
  GOOGLE_SCOPES,
  getOAuthClient,
  getGoogleAuthUrl,
  exchangeCodeForTokens,
  createGoogleCalendarEvent
};