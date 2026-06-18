/**
 * Configurable country-code-driven phone validation rules.
 * Add or edit entries here (or via the UI Settings panel, which mutates
 * a runtime copy of this list) to support more countries.
 *
 * digits: exact number of digits expected in the local (national) number,
 *         excluding the country/dial code.
 * digitsRange: optional [min, max] instead of an exact length.
 * dialCode: the international dial code, used to strip a leading "+countrycode"
 *           before counting digits.
 * leadingDigits: optional regex fragment constraining the first digit(s)
 *           of a valid local number (helps catch landline-vs-mobile typos).
 */
export const DEFAULT_COUNTRY_PHONE_RULES = [
  {
    code: "SG",
    name: "Singapore",
    dialCode: "65",
    digits: 8,
    leadingDigits: "[3689]",
  },
  {
    code: "IN",
    name: "India",
    dialCode: "91",
    digits: 10,
    leadingDigits: "[6-9]",
  },
  { code: "US", name: "United States", dialCode: "1", digits: 10 },
  { code: "CA", name: "Canada", dialCode: "1", digits: 10 },
  { code: "GB", name: "United Kingdom", dialCode: "44", digits: 10 },
  { code: "AU", name: "Australia", dialCode: "61", digits: 9 },
  { code: "MY", name: "Malaysia", dialCode: "60", digitsRange: [9, 10] },
  { code: "ID", name: "Indonesia", dialCode: "62", digitsRange: [9, 12] },
  { code: "PH", name: "Philippines", dialCode: "63", digits: 10 },
  { code: "TH", name: "Thailand", dialCode: "66", digits: 9 },
  { code: "VN", name: "Vietnam", dialCode: "84", digitsRange: [9, 10] },
  { code: "CN", name: "China", dialCode: "86", digits: 11 },
  { code: "JP", name: "Japan", dialCode: "81", digitsRange: [9, 10] },
  { code: "KR", name: "South Korea", dialCode: "82", digitsRange: [9, 10] },
  { code: "AE", name: "United Arab Emirates", dialCode: "971", digits: 9 },
  { code: "SA", name: "Saudi Arabia", dialCode: "966", digits: 9 },
  { code: "DE", name: "Germany", dialCode: "49", digitsRange: [10, 11] },
  { code: "FR", name: "France", dialCode: "33", digits: 9 },
  { code: "NZ", name: "New Zealand", dialCode: "64", digitsRange: [8, 9] },
  { code: "BR", name: "Brazil", dialCode: "55", digits: 11 },
];

export function getCountryRule(rules, countryCode) {
  if (!countryCode) return null;
  const normalized = String(countryCode).trim().toUpperCase();
  return (
    rules.find(
      (r) => r.code === normalized || r.name.toUpperCase() === normalized,
    ) || null
  );
}

export function getCountryRuleByDialCode(rules, dialCode) {
  return (
    rules.find((r) => r.dialCode === String(dialCode).replace("+", "")) || null
  );
}
