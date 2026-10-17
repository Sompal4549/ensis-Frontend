import DOMPurify from "isomorphic-dompurify";

/**
 * Product names can carry light formatting from the admin (e.g. <sup>, <b>).
 * Keep only inline formatting tags so a stored name can never inject scripts or links.
 */
export const sanitizeInlineHtml = (html?: string | null): string =>
  DOMPurify.sanitize(html || "", {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "sup", "sub", "br", "span", "small"],
    ALLOWED_ATTR: [],
  });
