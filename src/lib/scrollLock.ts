let lockCount = 0;

export function lockScroll(): void {
  lockCount += 1;
  if (typeof document === "undefined") return;
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

export function unlockScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0 || typeof document === "undefined") return;
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}
