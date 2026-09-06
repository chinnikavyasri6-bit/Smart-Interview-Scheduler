const {
  formatInTimeZone,
  fromZonedTime,
  toZonedTime
} = require("date-fns-tz");

const convertToUTC = (localDateTime, timezone) => {
  return fromZonedTime(localDateTime, timezone);
};

const convertFromUTC = (utcDate, timezone) => {
  return toZonedTime(utcDate, timezone);
};

const formatInTimezone = (
  utcDate,
  timezone,
  format = "yyyy-MM-dd HH:mm:ss"
) => {
  return formatInTimeZone(utcDate, timezone, format);
};

module.exports = {
  convertToUTC,
  convertFromUTC,
  formatInTimezone
};