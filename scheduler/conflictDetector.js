const hasTimeOverlap = (startA, endA, startB, endB) => {
  return (
    new Date(startA) < new Date(endB) &&
    new Date(endA) > new Date(startB)
  );
};

const hasConflict = (candidateSlot, existingEvents) => {
  return existingEvents.some((event) =>
    hasTimeOverlap(
      candidateSlot.start,
      candidateSlot.end,
      event.start,
      event.end
    )
  );
};

const removeConflictingSlots = (slots, existingEvents) => {
  return slots.filter(
    (slot) => !hasConflict(slot, existingEvents)
  );
};

module.exports = {
  hasTimeOverlap,
  hasConflict,
  removeConflictingSlots
};