import { DateTime } from "luxon";

export function minutesOfDay(dt: DateTime) { return dt.hour * 60 + dt.minute; }

export function inQuietHours(local: DateTime, startMin?: number|null, endMin?: number|null) {
  if (startMin == null || endMin == null) return false;
  const m = minutesOfDay(local);
  if (startMin <= endMin) return m >= startMin && m < endMin; // same-day window
  return m >= startMin || m < endMin; // wraps past midnight
}

export function nextEndOfQuiet(local: DateTime, startMin?: number|null, endMin?: number|null) {
  if (startMin == null || endMin == null) return local;
  const todayStart = local.startOf('day').plus({ minutes: startMin });
  const todayEnd = local.startOf('day').plus({ minutes: endMin });
  if (startMin <= endMin) {
    if (local < todayEnd && local >= todayStart) return todayEnd;
    return local;
  } else {
    // window spans midnight
    if (local >= todayStart) return todayEnd.plus({ days: 1 });
    if (local < todayEnd) return todayEnd;
    return local;
  }
}
