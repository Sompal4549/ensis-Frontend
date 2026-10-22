/** Search engines show about 155-160 characters of a meta description */
export const META_DESCRIPTION_MAX = 160;

/** Plain text, cut at a word boundary to fit a meta description */
export function metaDescription(value: unknown, max = META_DESCRIPTION_MAX): string {
  const text = String(value ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, "")}…`;
}

/**
 * Admin-entered schema markup → valid JSON-LD for a <script> tag, or null when it cannot be read.
 * Accepts what people often paste: a <script> wrapper, unquoted keys, trailing commas.
 */
export function toJsonLd(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === "object") return safeJson(raw);
  const source = String(raw)
    .replace(/<script[^>]*>/gi, "")
    .replace(/<\/script>/gi, "")
    .trim();
  if (!source) return null;
  const attempts = [
    source,
    source
      // pasted as JavaScript: "const schema = { … };"
      .replace(/^[^{[]*/, "")
      .replace(/;\s*$/, "")
      // bare keys: { name: … } → { "name": … }
      .replace(/([{,]\s*)([A-Za-z_@$][\w@$-]*)\s*:/g, '$1"$2":')
      // trailing commas
      .replace(/,\s*([}\]])/g, "$1"),
  ];
  for (const attempt of attempts) {
    try {
      return safeJson(JSON.parse(attempt));
    } catch {
      // try the next form
    }
  }
  return null;
}

/** JSON that cannot close the surrounding <script> tag */
const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
