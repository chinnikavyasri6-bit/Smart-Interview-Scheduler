const { z } = require("zod");

const createInterviewSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),

  candidate: z.string().min(1, "Candidate ID is required"),

  interviewers: z
    .array(z.string())
    .min(1, "At least one interviewer is required"),

  duration: z
    .number()
    .min(15, "Interview duration must be at least 15 minutes"),

  interviewType: z
    .enum([
      "technical",
      "hr",
      "managerial",
      "behavioral",
      "other"
    ])
    .default("technical"),

  timezone: z.string().min(1, "Timezone is required"),

  notes: z.string().optional().default("")
});

module.exports = {
  createInterviewSchema
};