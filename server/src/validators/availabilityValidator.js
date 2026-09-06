const { z } = require("zod");

const createAvailabilitySchema = z.object({
  start: z.string().datetime({
    message: "Start must be a valid ISO date-time"
  }),

  end: z.string().datetime({
    message: "End must be a valid ISO date-time"
  }),

  timezone: z.string().min(
    1,
    "Timezone is required"
  ),

  source: z
    .enum(["manual", "calendar"])
    .default("manual"),

  status: z
    .enum(["available", "unavailable"])
    .default("available")
});

module.exports = {
  createAvailabilitySchema
};