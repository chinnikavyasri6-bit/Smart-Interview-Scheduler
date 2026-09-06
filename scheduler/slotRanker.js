const calculateSlotScore = ({
  candidatePreference = 0,
  allParticipantsAvailable = false,
  workingHoursRespected = false,
  timezoneComfort = 0,
  workloadBalance = 0,
  operationalFit = 0
}) => {
  let score = 0;

  // Candidate preference: maximum 30
  score += Math.min(candidatePreference, 30);

  // All required participants available: 30
  if (allParticipantsAvailable) {
    score += 30;
  }

  // Working hours respected: 15
  if (workingHoursRespected) {
    score += 15;
  }

  // Timezone comfort: maximum 10
  score += Math.min(timezoneComfort, 10);

  // Workload balance: maximum 10
  score += Math.min(workloadBalance, 10);

  // Operational fit: maximum 5
  score += Math.min(operationalFit, 5);

  return score;
};

const rankSlots = (slots) => {
  return [...slots].sort((a, b) => b.score - a.score);
};

module.exports = {
  calculateSlotScore,
  rankSlots
};