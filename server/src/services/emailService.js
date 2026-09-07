const { Resend } = require("resend");

const sendInterviewConfirmationEmail = async ({
  recipient,
  interview,
  meetingLink
}) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "RESEND_API_KEY is not configured. Email was skipped."
    );

    return {
      id: null,
      skipped: true,
      reason: "RESEND_API_KEY not configured"
    };
  }

  const resend = new Resend(
    process.env.RESEND_API_KEY
  );

  const start = new Date(
    interview.selectedSlot.start
  );

  const end = new Date(
    interview.selectedSlot.end
  );

  const { data, error } =
    await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        "onboarding@resend.dev",

      to: [recipient],

      subject:
        `Interview Confirmed - ${interview.title}`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Interview Confirmed</h2>

          <p>
            Your interview has been successfully scheduled.
          </p>

          <p>
            <strong>Interview:</strong>
            ${interview.title}
          </p>

          <p>
            <strong>Start:</strong>
            ${start.toISOString()}
          </p>

          <p>
            <strong>End:</strong>
            ${end.toISOString()}
          </p>

          <p>
            <strong>Timezone:</strong>
            ${interview.timezone}
          </p>

          ${
            meetingLink
              ? `
                <p>
                  <strong>Google Meet:</strong>
                  <a href="${meetingLink}">
                    Join Interview
                  </a>
                </p>
              `
              : ""
          }

          <p>
            Smart Interview Scheduler
          </p>
        </div>
      `
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  sendInterviewConfirmationEmail
};