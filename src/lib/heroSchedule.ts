/**
 * Home hero slide scheduling (admin: Pages > Home > Hero Banner > a slide > "Schedule").
 *
 * A slide may carry ONE display window as datetime-local strings in India time ("2026-10-25T09:00").
 * Slides without a window are the normal hero. While at least one scheduled slide is live, ONLY the
 * live scheduled slides show; when every window is over, the normal slides are back automatically.
 * The window is [start, end): a slide appears AT its start and disappears AT its end, to the millisecond
 * (HeroCarousel flips with a timer, no reload needed).
 */
export type SlideSchedule = {
  /** "day" = one full day (Today / Tomorrow), "range" = from/until */
  mode?: "day" | "range";
  start?: string;
  end?: string;
};

type Schedulable = { schedule?: SlideSchedule | null };

/** Current time in epoch ms. The server sends it to the browser so a wrong device clock cannot show a wrong slide. */
export const currentTimeMs = (): number => Date.now();

const IST_OFFSET = "+05:30";

/** "2026-10-25T09:00" → epoch ms in IST; strings that already carry a zone are parsed as-is */
export const parseIstDateTime = (value?: string): number | null => {
  if (!value || typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(v);
  const withSeconds = /T\d{2}:\d{2}$/.test(v) ? `${v}:00` : v;
  const ms = Date.parse(hasZone ? v : `${withSeconds}${IST_OFFSET}`);
  return Number.isNaN(ms) ? null : ms;
};

const windowOf = (slide: Schedulable) => ({
  start: parseIstDateTime(slide.schedule?.start),
  end: parseIstDateTime(slide.schedule?.end),
});

/** A slide is "scheduled" when its window has at least one date; otherwise it is a normal hero slide */
export const isScheduled = (slide: Schedulable): boolean => {
  const { start, end } = windowOf(slide);
  return start !== null || end !== null;
};

/** Scheduled slide whose window contains `now`: start <= now < end (an open side is allowed) */
export const isSlideLive = (slide: Schedulable, now = Date.now()): boolean => {
  const { start, end } = windowOf(slide);
  if (start === null && end === null) return false;
  return (start === null || now >= start) && (end === null || now < end);
};

/** The slides to show at `now`: the live scheduled ones if any, otherwise the normal (unscheduled) ones */
export const visibleHeroSlides = <T extends Schedulable>(slides: T[], now = Date.now()): T[] => {
  const live = slides.filter((s) => isSlideLive(s, now));
  return live.length > 0 ? live : slides.filter((s) => !isScheduled(s));
};

/** The next moment (epoch ms) after `now` at which a scheduled slide starts or ends; null when nothing is left to change */
export const nextScheduleBoundary = (slides: Schedulable[], now = Date.now()): number | null => {
  let next: number | null = null;
  for (const slide of slides) {
    const { start, end } = windowOf(slide);
    for (const t of [start, end]) {
      if (t !== null && t > now && (next === null || t < next)) next = t;
    }
  }
  return next;
};
