const { z } = require("zod");

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  role: z.enum(
    ["candidate", "recruiter", "interviewer"],
    {
      message: "Role must be candidate, recruiter, or interviewer"
    }
  ),

  timezone: z
    .string()
    .min(1, "Timezone is required"),

  workingHours: z
    .object({
      start: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):[0-5]\d$/,
          "Start time must be in HH:MM format"
        ),

      end: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):[0-5]\d$/,
          "End time must be in HH:MM format"
        )
    })
    .optional()
});

module.exports = {
  createUserSchema
};