export interface GetInTouchItem {
  id: string;
  label: string;
  lines: string[];
}

export const staticGetInTouch = {
  heading: "Get In Touch",
  items: [
    { id: "corporate-office", label: "Corporate Office", lines: ["ENSIS Head Office, Kochi,", "Kerala, India"] },
    { id: "phone", label: "Phone", lines: ["+91 73560 55555"] },
    { id: "email", label: "Email", lines: ["info@ensis.in"] },
    { id: "website", label: "Website", lines: ["www.ensis.in"] },
    { id: "working-hours", label: "Working Hours", lines: ["Mon - Sat :", "9:00 AM - 6:00 PM"] },
  ] as GetInTouchItem[],
};
