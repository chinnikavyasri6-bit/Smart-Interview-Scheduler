const { addMinutes } = require("date-fns");

const generateSlots = ({
  start,
  end,
  duration,
  interval = 30
}) => {
  const slots = [];

  let currentStart = new Date(start);
  const finalEnd = new Date(end);

  while (true) {
    const currentEnd = addMinutes(currentStart, duration);

    if (currentEnd > finalEnd) {
      break;
    }

    slots.push({
      start: new Date(currentStart),
      end: new Date(currentEnd)
    });

    currentStart = addMinutes(currentStart, interval);

    if (currentStart >= finalEnd) {
      break;
    }
  }

  return slots;
};

module.exports = {
  generateSlots
};