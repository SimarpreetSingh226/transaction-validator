/**
 * Validates a raw date/time string against a set of enabled format
 * definitions. Also performs calendar sanity checks (no Feb 30, etc.)
 * for formats with extractable Y/M/D groups.
 */
export function validateDateTime(rawValue, formats, allowedFormatIds = null) {
  const value = String(rawValue ?? "").trim();
  if (!value) {
    return {
      valid: false,
      matchedFormat: null,
      message: "Date/time value is empty",
    };
  }

  const candidates = allowedFormatIds
    ? formats.filter((f) => allowedFormatIds.includes(f.id) && f.enabled)
    : formats.filter((f) => f.enabled);

  for (const fmt of candidates) {
    const match = value.match(fmt.regex);
    if (!match) continue;

    const calendarCheck = checkCalendarSanity(fmt.id, match);
    if (!calendarCheck.valid) {
      return {
        valid: false,
        matchedFormat: fmt.id,
        message: calendarCheck.message,
      };
    }

    return { valid: true, matchedFormat: fmt.id, message: "" };
  }

  const expected = candidates.map((f) => f.label).join(", ");
  return {
    valid: false,
    matchedFormat: null,
    message: `Does not match any accepted format (${expected || "none enabled"})`,
  };
}

function checkCalendarSanity(formatId, match) {
  let year, month, day;

  if (
    formatId === "iso-date" ||
    formatId === "iso-datetime" ||
    formatId === "iso-datetime-tz"
  ) {
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  } else if (formatId === "dmy-slash" || formatId === "dmy-dash") {
    day = Number(match[1]);
    month = Number(match[2]);
    year = Number(match[3]);
  } else if (formatId === "mdy-slash") {
    month = Number(match[1]);
    day = Number(match[2]);
    year = Number(match[3]);
  } else {
    return { valid: true };
  }

  if (month < 1 || month > 12) {
    return { valid: false, message: `Month ${month} is out of range (1-12)` };
  }
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return {
      valid: false,
      message: `Day ${day} is invalid for month ${month}`,
    };
  }
  if (year < 1900 || year > 2100) {
    return {
      valid: false,
      message: `Year ${year} looks out of a plausible range`,
    };
  }

  // time component sanity (groups 4,5,6 when present)
  if (match[4] !== undefined && match[5] !== undefined) {
    const h = Number(match[4]);
    const m = Number(match[5]);
    const s = match[6] !== undefined ? Number(match[6]) : 0;
    if (h > 23 || m > 59 || s > 59) {
      return { valid: false, message: "Time component out of range" };
    }
  }

  return { valid: true };
}
