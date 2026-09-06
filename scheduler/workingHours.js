const getMinutesFromTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const getLocalTimeParts = (date, timezone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);

  const hour = Number(
    parts.find((part) => part.type === "hour").value
  );

  const minute = Number(
    parts.find((part) => part.type === "minute").value
  );

  return {
    hour,
    minute
  };
};

const isWithinWorkingHours = (
  date,
  timezone,
  workingHours
) => {
  const { hour, minute } = getLocalTimeParts(
    date,
    timezone
  );

  const currentMinutes = hour * 60 + minute;

  const startMinutes = getMinutesFromTime(
    workingHours.start
  );

  const endMinutes = getMinutesFromTime(
    workingHours.end
  );

  return (
    currentMinutes >= startMinutes &&
    currentMinutes < endMinutes
  );
};

module.exports = {
  getMinutesFromTime,
  isWithinWorkingHours
};