"use client";

import { useEffect, useState } from "react";
import { DEFAULT_HR_SETTINGS, getCareerSettings } from "@/lib/careerApi";

type HrContact = { email: string; phone: string; address: string };

/** HR contact from the admin career settings (Careers → Settings), with footer-consistent defaults. */
export function useHrContact(): HrContact & { phoneHref: string } {
  const [contact, setContact] = useState<HrContact>(DEFAULT_HR_SETTINGS.hrContact!);

  useEffect(() => {
    let alive = true;
    getCareerSettings()
      .then((s) => {
        if (!alive || !s?.hrContact) return;
        setContact({
          email: s.hrContact.email || DEFAULT_HR_SETTINGS.hrContact!.email,
          phone: s.hrContact.phone || DEFAULT_HR_SETTINGS.hrContact!.phone,
          address: s.hrContact.address || DEFAULT_HR_SETTINGS.hrContact!.address,
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return { ...contact, phoneHref: "tel:" + contact.phone.replace(/[^\d+]/g, "") };
}
