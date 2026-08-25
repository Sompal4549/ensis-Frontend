export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ensis.in"
).replace(/\/+$/, "");

export const SITE_HOST = new URL(SITE_URL).host;
