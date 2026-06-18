import { getCountryRule } from "../config/countryPhoneRules.js";

/**
 * Strips formatting characters (spaces, dashes, parens) from a phone string,
 * keeping a leading + if present.
 */
export function cleanPhoneRaw(raw) {
  if (raw == null) return "";
  const str = String(raw).trim();
  const hasPlus = str.startsWith("+");
  const digitsOnly = str.replace(/[^\d]/g, "");
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

/**
 * Validates a phone number against the rule for the given country code.
 * Returns { valid, normalized, message }.
 */
export function validatePhone(rawPhone, countryCode, rules) {
  const rule = getCountryRule(rules, countryCode);
  const cleaned = cleanPhoneRaw(rawPhone);

  if (!cleaned) {
    return { valid: false, normalized: "", message: "Phone number is empty" };
  }

  if (!rule) {
    return {
      valid: false,
      normalized: cleaned,
      message: `No validation rule configured for country code "${countryCode}"`,
    };
  }

  // Strip dial code if present (e.g. "+6591234567" -> "91234567")
  let local = cleaned;
  if (local.startsWith("+")) {
    local = local.slice(1);
    if (local.startsWith(rule.dialCode)) {
      local = local.slice(rule.dialCode.length);
    }
  } else if (local.startsWith(rule.dialCode) && local.length > rule.digits) {
    // ambiguous case: number includes dial code with no plus, e.g. "6591234567"
    const withoutDial = local.slice(rule.dialCode.length);
    const expectedLen = rule.digits ?? rule.digitsRange?.[1];
    if (withoutDial.length === expectedLen) {
      local = withoutDial;
    }
  }

  const lengthOk = rule.digits
    ? local.length === rule.digits
    : local.length >= rule.digitsRange[0] &&
      local.length <= rule.digitsRange[1];

  if (!lengthOk) {
    const expected = rule.digits
      ? `${rule.digits} digits`
      : `${rule.digitsRange[0]}-${rule.digitsRange[1]} digits`;
    return {
      valid: false,
      normalized: local,
      message: `${rule.name} numbers must have ${expected}, got ${local.length}`,
    };
  }

  if (rule.leadingDigits) {
    const leadingRe = new RegExp(`^${rule.leadingDigits}`);
    if (!leadingRe.test(local)) {
      return {
        valid: false,
        normalized: local,
        message: `${rule.name} numbers must start with a digit matching ${rule.leadingDigits}`,
      };
    }
  }

  return { valid: true, normalized: `+${rule.dialCode}${local}`, message: "" };
}
