const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: z.enum([
    "candidate",
    "recruiter",
    "interviewer"
  ]),

  timezone: z
    .string()
    .min(1, "Timezone is required"),

  workingHours: z
    .object({
      start: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):[0-5]\d$/,
          "Invalid start time"
        ),

      end: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):[0-5]\d$/,
          "Invalid end time"
        )
    })
    .optional()
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
});

module.exports = {
  registerSchema,
  loginSchema
};