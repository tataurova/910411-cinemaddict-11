import moment from "moment";

export const formatDuration = (duration) => {
  return moment.utc(moment.duration(duration, `minutes`).asMilliseconds()).format(`H[h] mm[m]`);
};
