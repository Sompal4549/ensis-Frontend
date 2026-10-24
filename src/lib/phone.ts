export interface PhoneNumber {
  label: string;
  href: string;
}

/**
 * Splits "+91 9654900525, +91 9810242841" (also "/", ";", "|", "&", "or", new lines or <br>)
 * into separate numbers so each one gets its own tel: link instead of one link for the whole string.
 */
export function splitPhoneNumbers(text: string): PhoneNumber[] {
  return (text || "")
    .replace(/<[^>]*>/g, ",")
    .split(/[,;/|\n]|\s&\s|\sor\s/i)
    .map((part) => part.trim())
    .filter((part) => part.replace(/\D/g, "").length >= 7)
    .map((label) => ({ label, href: `tel:${label.replace(/[^\d+]/g, "")}` }));
}
