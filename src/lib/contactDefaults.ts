/**
 * Offices and email of the approved design. The footer and the Contact page both show them until the
 * Contact page → Get In Touch section (admin) has its own "Office" / "Email" entries, so the two always match.
 */
export const DEFAULT_OFFICES = [
  {
    key: "corporate-office",
    title: "Corporate Office | Delhi-NCR, India",
    text: "Plot No. 12/29, Site-II Industrial Area, Loni Road, Mohan Nagar,\nGhaziabad, Uttar Pradesh – 201007, India",
  },
  {
    key: "regional-office",
    title: "Regional Office | Delhi, India",
    text: "Ground Floor, E-1, Main Market, Opp. KFC, Kalkaji, New Delhi – 110019, India",
  },
  {
    key: "mumbai-branch-office",
    title: "Mumbai Branch Office",
    text: "UNIT-IISR Compound, Plot No 49/459., Opp Dynamic Flow Company,\nWakanpada Road, Vasai Phata, Vasai East – 401208, India",
  },
];

export const DEFAULT_EMAIL_TEXT = "info@ensis.in";

interface ContactDetailLike {
  id: string;
  icon?: string;
  title: string;
  description: string;
}

/**
 * The Contact page's contact list with the default offices and email filled in when the admin has not
 * added any "Office" entries yet. The old single "Our Address" entry is replaced by the offices.
 */
export function withDefaultContactEntries<T extends ContactDetailLike>(details: T[]): ContactDetailLike[] {
  const list = (details || []).filter((d) => d?.title || d?.description);
  if (list.some((d) => /office/i.test(d.title || ""))) {
    return list.filter((d) => !/e-?mail/i.test(d.title || ""));
  }

  const icon = list.find((d) => /address/i.test(d.title || ""))?.icon || "";
  const rest = list.filter(
    (d) => !/^\s*our\s+address\s*$/i.test(d.title || "") && !/e-?mail/i.test(d.title || "")
  );
  return [
    ...DEFAULT_OFFICES.map((o) => ({ id: o.key, icon, title: o.title, description: o.text.replace(/\n/g, "<br>") })),
    ...rest,
  ];
}
