/**
 * Predefined date/time formats the validator accepts. Each entry has a
 * regex matcher plus a human label shown in the UI. Order matters only
 * for display; matching tries every enabled pattern.
 */
export const DEFAULT_DATE_FORMATS = [
  {
    id: "iso-date",
    label: "YYYY-MM-DD",
    example: "2026-06-18",
    regex: /^(\d{4})-(\d{2})-(\d{2})$/,
    enabled: true,
  },
  {
    id: "iso-datetime",
    label: "YYYY-MM-DD HH:mm:ss",
    example: "2026-06-18 14:32:00",
    regex: /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/,
    enabled: true,
  },
  {
    id: "iso-datetime-tz",
    label: "YYYY-MM-DDTHH:mm:ssZ",
    example: "2026-06-18T14:32:00Z",
    regex:
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/,
    enabled: true,
  },
  {
    id: "dmy-slash",
    label: "DD/MM/YYYY",
    example: "18/06/2026",
    regex: /^(\d{2})\/(\d{2})\/(\d{4})$/,
    enabled: true,
  },
  {
    id: "mdy-slash",
    label: "MM/DD/YYYY",
    example: "06/18/2026",
    regex: /^(\d{2})\/(\d{2})\/(\d{4})$/,
    enabled: false,
  },
  {
    id: "dmy-dash",
    label: "DD-MM-YYYY",
    example: "18-06-2026",
    regex: /^(\d{2})-(\d{2})-(\d{4})$/,
    enabled: true,
  },
  {
    id: "time-24h",
    label: "HH:mm (24h)",
    example: "14:32",
    regex: /^([01]\d|2[0-3]):([0-5]\d)$/,
    enabled: true,
  },
];

export const FIELD_FORMAT_GROUPS = {
  order_date: [
    "iso-date",
    "iso-datetime",
    "iso-datetime-tz",
    "dmy-slash",
    "dmy-dash",
  ],
  delivery_date: [
    "iso-date",
    "iso-datetime",
    "iso-datetime-tz",
    "dmy-slash",
    "dmy-dash",
  ],
  transaction_time: ["time-24h", "iso-datetime", "iso-datetime-tz"],
};
