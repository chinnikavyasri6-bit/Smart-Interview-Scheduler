const Availability = require("../models/Availability");

const mergeOverlappingSlots = (slots) => {
  if (slots.length === 0) {
    return [];
  }

  const sortedSlots = [...slots].sort(
    (a, b) => a.start - b.start
  );

  const merged = [sortedSlots[0]];

  for (let i = 1; i < sortedSlots.length; i++) {
    const current = sortedSlots[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      if (current.end > last.end) {
        last.end = current.end;
      }
    } else {
      merged.push(current);
    }
  }

  return merged;
};

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

  // Add availability records for each participant
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

  // Merge duplicate/overlapping availability
  // for each participant.
  for (const userId of userIds) {
    availabilityByUser[userId] =
      mergeOverlappingSlots(
        availabilityByUser[userId]
      );
  }

  // If any participant has no availability,
  // there cannot be a common slot.
  const hasNoAvailability = userIds.some(
    (userId) =>
      availabilityByUser[userId].length === 0
  );

  if (hasNoAvailability) {
    return [];
  }

  let commonSlots =
    availabilityByUser[userIds[0]];

  // Find intersection between all participants.
  for (let i = 1; i < userIds.length; i++) {
    const nextUserSlots =
      availabilityByUser[userIds[i]];

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

    commonSlots =
      mergeOverlappingSlots(intersections);
  }

  return commonSlots.sort(
    (a, b) => a.start - b.start
  );
};

module.exports = {
  findCommonAvailability
};