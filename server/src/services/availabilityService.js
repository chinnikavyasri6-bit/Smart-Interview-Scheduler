const Availability = require("../models/Availability");

const findCommonAvailability = async ({
  userIds,
  rangeStart,
  rangeEnd
}) => {
  const availabilityRecords = await Availability.find({
    user: { $in: userIds },
    status: "available",
    start: { $lt: rangeEnd },
    end: { $gt: rangeStart }
  }).sort({ start: 1 });

  const availabilityByUser = {};

  for (const userId of userIds) {
    availabilityByUser[userId] = [];
  }

  for (const record of availabilityRecords) {
    availabilityByUser[record.user.toString()].push({
      start: new Date(
        Math.max(
          new Date(record.start).getTime(),
          new Date(rangeStart).getTime()
        )
      ),
      end: new Date(
        Math.min(
          new Date(record.end).getTime(),
          new Date(rangeEnd).getTime()
        )
      )
    });
  }

  // If any participant has no availability,
  // there cannot be a common slot.
  const hasNoAvailability = userIds.some(
    (userId) => availabilityByUser[userId].length === 0
  );

  if (hasNoAvailability) {
    return [];
  }

  let commonSlots = availabilityByUser[userIds[0]];

  for (let i = 1; i < userIds.length; i++) {
    const nextUserSlots = availabilityByUser[userIds[i]];

    const intersections = [];

    for (const slotA of commonSlots) {
      for (const slotB of nextUserSlots) {
        const start = new Date(
          Math.max(
            slotA.start.getTime(),
            slotB.start.getTime()
          )
        );

        const end = new Date(
          Math.min(
            slotA.end.getTime(),
            slotB.end.getTime()
          )
        );

        if (start < end) {
          intersections.push({
            start,
            end
          });
        }
      }
    }

    commonSlots = intersections;
  }

  return commonSlots.sort(
    (a, b) => a.start - b.start
  );
};

module.exports = {
  findCommonAvailability
};