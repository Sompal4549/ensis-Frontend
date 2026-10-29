export interface PolicySection {
  id: string;
  number: string;
  title: string;
  text: string;
  bullets?: string[];
  extra?: string;
  extra2?: string;
  link?: { href: string; label: string };
}

export const staticTermsSections: PolicySection[] = [
  {
    id: "acceptance-of-terms",
    number: "01",
    title: "Acceptance of Terms",
    text: "By accessing the ENSIS website, browsing our catalogue, placing an order or submitting an enquiry, you agree to these Terms & Conditions with Design House India Pvt. Ltd. (ENSIS). If you do not agree, please do not use the website.",
    extra: "These terms apply to all visitors, users, customers and business partners.",
  },
  {
    id: "products-services",
    number: "02",
    title: "Products & Services",
    text: "ENSIS designs, manufactures and installs Ayurvedic, Panchkarma, spa and wellness equipment and furniture, and delivers turnkey wellness spaces and consultancy. Specifications, dimensions, finishes and prices may change without prior notice.",
    bullets: [
      "Product images are indicative; natural materials such as solid wood vary in grain and shade.",
      "Custom-built products are manufactured to the drawings and specifications you approve.",
      "Turnkey and consultancy projects are governed by the separate proposal or agreement for that project.",
    ],
  },
  {
    id: "quotations-orders",
    number: "03",
    title: "Quotations & Orders",
    text: "Quotations are valid for 30 days unless stated otherwise. An order is confirmed only when we accept it in writing and receive the agreed advance payment.",
    extra: "Prices exclude GST, freight, installation and site work unless the quotation says they are included.",
  },
  {
    id: "payments",
    number: "04",
    title: "Payments",
    text: "Payment terms are set out in each quotation or invoice. Online payments are processed by our payment gateway partner; we do not store your card or bank details.",
    bullets: [
      "Standard products: full payment before dispatch unless agreed otherwise.",
      "Custom and turnkey projects: payment in the milestones stated in the proposal.",
      "Delayed payments may delay production, dispatch or installation.",
    ],
  },
  {
    id: "shipping-delivery",
    number: "05",
    title: "Shipping & Delivery",
    text: "We ship across India and to international destinations. Delivery dates are estimates and depend on production, transport and site readiness. Risk passes to you on delivery; please check goods at delivery and note visible damage on the delivery receipt.",
  },
  {
    id: "installation-site-readiness",
    number: "06",
    title: "Installation & Site Readiness",
    text: "Where installation is included, you are responsible for site access, civil work, plumbing, electrical points and any permissions required. Additional visits caused by an unready site may be charged.",
  },
  {
    id: "cancellations-returns",
    number: "07",
    title: "Cancellations & Returns",
    text: "Standard products may be cancelled before dispatch, subject to deduction of costs already incurred. Custom-made products and project work cannot be cancelled once production has started. Returns are accepted only for items that arrive damaged or defective and are reported within 48 hours of delivery.",
  },
  {
    id: "warranty",
    number: "08",
    title: "Warranty",
    text: "ENSIS equipment carries a 5-year structural warranty against manufacturing defects, unless the product documentation states otherwise.",
    bullets: [
      "The warranty does not cover normal wear, misuse, water or oil damage from improper care, or unauthorised repairs.",
      "Electrical and motorised parts are covered for the period stated in the product documentation.",
      "Warranty service is provided by repair or replacement at our discretion.",
    ],
  },
  {
    id: "intellectual-property",
    number: "09",
    title: "Intellectual Property",
    text: "All content on this website — text, product designs, drawings, layouts, images, logos and videos — belongs to ENSIS or its licensors. You may not copy, reproduce or use it commercially without our written permission. Designs and layouts we prepare for your project remain our property until paid for in full.",
  },
  {
    id: "website-use",
    number: "10",
    title: "Website Use",
    text: "You agree not to misuse the website, including attempting unauthorised access, submitting false information, or interfering with its operation. Information on the website, including chatbot answers, is for general guidance and does not replace a written quotation or professional medical advice.",
  },
  {
    id: "limitation-of-liability",
    number: "11",
    title: "Limitation of Liability",
    text: "To the extent permitted by law, ENSIS is not liable for indirect or consequential losses, such as loss of business or profit. Our total liability for any claim is limited to the amount paid for the product or service concerned.",
  },
  {
    id: "governing-law-disputes",
    number: "12",
    title: "Governing Law & Disputes",
    text: "These terms are governed by the laws of India. Disputes will first be addressed through good-faith discussion; failing that, they are subject to the exclusive jurisdiction of the courts at Ghaziabad, Uttar Pradesh.",
    extra: "Questions about these terms: info@ensis.in or +91 9654900525.",
  },
];

export interface RefundCard {
  icon: string;
  title: string;
  text: string;
}

export interface RefundSection extends PolicySection {
  cards?: RefundCard[];
  checkItems?: string[];
}

export const staticRefundSections: RefundSection[] = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
    text: "This Refund Policy applies to all products and services provided by ENSIS – Panchkarma & Spa Solutions, a brand of Design House India Pvt Ltd. (\u201Cwe\u201D, \u201Cus\u201D, \u201Cour\u201D). It outlines the circumstances under which cancellations, refunds or adjustments may be considered for payments made through our Website, enquiries, quotations, purchase orders or service contracts.",
  },
  {
    id: "scope",
    number: "02",
    title: "Scope",
    text: "This policy covers standard products, customised products, project-based orders, consultancy services, training, and other services offered by ENSIS through our Website (https://web.ensis.in), email, phone or authorised representatives.",
  },
  {
    id: "cancellation-policy",
    number: "03",
    title: "Cancellation Policy",
    text: "Cancellation requests must be submitted in writing. The applicable terms depend on the stage your order has reached:",
    cards: [
      {
        icon: "file-x",
        title: "Before Order Confirmation",
        text: "You may cancel your enquiry or request at any time before a formal order is confirmed. No charges will be applied.",
      },
      {
        icon: "settings",
        title: "After Order Confirmation",
        text: "Cancellation may be possible only with written request and subject to project stage, material procurement and customisation status.",
      },
      {
        icon: "puzzle",
        title: "Customised / Project Orders",
        text: "Once raw material procurement or design work has commenced, cancellation may not be possible or may attract partial charges.",
      },
      {
        icon: "calendar",
        title: "Event / Training / Consultation",
        text: "Cancellations for events, training or consultancy services must be made as per the guidelines communicated at the time of booking.",
      },
    ],
  },
  {
    id: "refund-eligibility",
    number: "04",
    title: "Refund Eligibility",
    text: "A refund may be considered in the following cases:",
    checkItems: [
      "Advance payment made for confirmed orders, if cancellation is requested before production or dispatch.",
      "Duplicate payment made due to technical error.",
      "Services cancelled by ENSIS due to unforeseen circumstances.",
      "If the product delivered is significantly different from the agreed specifications, and cannot be rectified (as per our assessment).",
      "Any other genuine reason, subject to written approval from ENSIS management.",
    ],
  },
  {
    id: "refund-process",
    number: "05",
    title: "Refund Process",
    text: "To request a refund, write to info@ensis.in with your order reference, proof of payment and the reason for the request. Our team will acknowledge your request within 2 working days and verify the details against our records.",
    bullets: [
      "Approved refunds are credited to the original payment method used for the transaction.",
      "Refund approvals are communicated in writing by an authorised ENSIS representative.",
      "We may request additional information or documentation to process your claim.",
    ],
  },
  {
    id: "timelines",
    number: "06",
    title: "Timelines",
    text: "Once a refund is approved, processing typically follows this schedule:",
    bullets: [
      "Credit/debit card and net banking refunds: 7–10 working days, subject to bank processing.",
      "UPI and wallet refunds: 3–5 working days.",
      "Cheque or bank transfer refunds: 10–15 working days.",
    ],
    extra: "Timelines are indicative and may vary depending on the bank or payment provider.",
  },
  {
    id: "non-refundable-items",
    number: "07",
    title: "Non-Refundable Items",
    text: "Certain categories of payments are non-refundable by default:",
    bullets: [
      "Products that have been dispatched, installed or used.",
      "Customised or made-to-order products after design approval and material procurement.",
      "Delivered services such as consultancy, training, site visits and audits.",
      "Amounts paid towards logistics, freight, packing or third-party services.",
      "Government levies, GST and other statutory charges.",
    ],
  },
  {
    id: "project-based-custom-orders",
    number: "08",
    title: "Project-Based & Custom Orders",
    text: "Project-based and custom orders are governed by the milestone schedule mentioned in the signed quotation or contract. Refund eligibility is calculated only on the unearned portion of the payment, adjusted for materials procured, work completed and administrative costs.",
    extra: "Any advance forfeited or adjusted will be communicated in writing before closure of the project.",
  },
  {
    id: "service-consultancy-fees",
    number: "09",
    title: "Service & Consultancy Fees",
    text: "Service and consultancy fees are non-refundable once the engagement has commenced. If a service is cancelled by ENSIS before commencement, a full refund of the collected fee will be issued within the timelines mentioned in section 06.",
  },
  {
    id: "payment-gateway-bank-charges",
    number: "10",
    title: "Payment Gateway & Bank Charges",
    text: "Payment gateway convenience fees, bank charges and transaction fees charged by third parties are non-refundable. In the case of a refund, these charges will be deducted from the refundable amount.",
    extra: "In rare cases of a failed or duplicate transaction, we will assist you in raising a chargeback request with the payment provider.",
  },
  {
    id: "modifications-rescheduling",
    number: "11",
    title: "Modifications & Rescheduling",
    text: "Requests to modify quantities, specifications or delivery schedules after order confirmation are subject to a re-estimation of cost. If the modification increases the order value, the difference is payable before production resumes; if it reduces the value, the difference is adjusted against the balance payable or future invoices rather than refunded.",
    extra: "Event, training and consultation sessions may be rescheduled once at no cost if requested at least 7 days in advance. Later rescheduling may attract a rescheduling fee.",
  },
  {
    id: "disputes",
    number: "12",
    title: "Disputes",
    text: "In case of any disagreement regarding a refund decision, please write to our team with supporting evidence. We will review the matter and respond within 15 working days.",
    extra: "These terms are governed by the laws of India, and disputes are subject to the exclusive jurisdiction of the courts of Kochi, Kerala.",
    link: { href: "/terms-and-conditions", label: "Read our Terms & Conditions" },
  },
  {
    id: "contact-us",
    number: "13",
    title: "Contact Us",
    text: "For refund requests, cancellations or any related questions, reach out to our team:",
    bullets: [
      "Email: info@ensis.in",
      "Phone: +91 9654900525",
    ],
    extra: "Design House India Pvt Ltd (ENSIS – Panchkarma & Spa Solutions), Kochi, Kerala, India.",
  },
];

export interface DisclaimerSection {
  id: string;
  number: string;
  title: string;
  text: string;
  icon: string;
}

export const staticDisclaimerSections: DisclaimerSection[] = [
  {
    id: "general-information",
    number: "1",
    title: "General Information",
    text: "The information provided on this website https://web.ensis.in (the \u201CWebsite\u201D) is for general informational purposes only. ENSIS – Panchkarma & Spa Solutions is a brand of Design House India Pvt Ltd. While we strive to keep the information accurate, up to date and complete, we make no warranties or representations of any kind, express or implied, about the accuracy, reliability, completeness, suitability or availability of the content on this Website.",
    icon: "file-text",
  },
  {
    id: "product-information",
    number: "2",
    title: "Product Information",
    text: "All products, specifications, designs, dimensions, features and other details shown on this Website are for illustrative and general guidance purposes only. Actual products may vary slightly due to colour variation, material properties, manufacturing process or customisation. We reserve the right to modify product details, specifications and pricing without prior notice.",
    icon: "package",
  },
  {
    id: "images-and-visuals",
    number: "3",
    title: "Images and Visuals",
    text: "The images, renders and photographs displayed on this Website are for representative purposes only. They may include customised projects, concept designs or sample installations. Actual product colour, finish, texture and appearance may vary due to lighting, screen settings, manufacturing differences and project-specific customisation.",
    icon: "image",
  },
  {
    id: "third-party-links",
    number: "4",
    title: "Third-Party Links",
    text: "This Website may contain links to third-party websites for your convenience. We do not endorse or take responsibility for the content, privacy practices or policies of any third-party websites. Accessing such links is at your own risk.",
    icon: "link",
  },
  {
    id: "professional-advice",
    number: "5",
    title: "Professional Advice",
    text: "The content on this Website does not constitute professional, medical, legal or technical advice. For specific project requirements, product suitability, installation, usage or other professional guidance, please contact our team directly for consultation.",
    icon: "users",
  },
  {
    id: "limitation-of-liability",
    number: "6",
    title: "Limitation of Liability",
    text: "To the fullest extent permitted by law, ENSIS and Design House India Pvt Ltd. shall not be liable for any direct, indirect, incidental, special or consequential losses or damages arising from the use of this Website, its content, products or services.",
    icon: "shield",
  },
  {
    id: "availability-of-products-and-services",
    number: "7",
    title: "Availability of Products and Services",
    text: "All products and services are subject to availability, project feasibility, customisation requirements and mutually agreed terms. We reserve the right to discontinue or modify any product or service at any time without prior notice.",
    icon: "cart",
  },
  {
    id: "intellectual-property",
    number: "8",
    title: "Intellectual Property",
    text: "All content, including text, images, logos, designs, product information and code, is the property of Design House India Pvt Ltd. and/or its brand ENSIS, unless otherwise stated. Unauthorised use, reproduction or distribution is strictly prohibited.",
    icon: "copyright",
  },
  {
    id: "user-responsibility",
    number: "9",
    title: "User Responsibility",
    text: "By using this Website, you agree to use the information responsibly and not for any unlawful, misleading or unauthorised purpose.",
    icon: "user",
  },
  {
    id: "changes-to-disclaimer",
    number: "10",
    title: "Changes to Disclaimer",
    text: "We may update this Disclaimer from time to time. Any changes will be posted on this page with the revised \u201CLast Updated\u201D date.",
    icon: "file-cog",
  },
  {
    id: "contact-us",
    number: "11",
    title: "Contact Us",
    text: "If you have any questions about this Disclaimer, please contact us at info@ensis.in.",
    icon: "mail",
  },
];

export interface PrivacyCard {
  icon: string;
  title: string;
  text: string;
}

export interface PrivacySection extends PolicySection {
  cards?: PrivacyCard[];
  checkItems?: string[];
}

export const staticPrivacySections: PrivacySection[] = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
    text: "Design House India Pvt. Ltd. (operating under the brand ENSIS) (\u201Cwe\u201D, \u201Cus\u201D, \u201Cour\u201D) values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose and safeguard your information when you visit our website https://web.ensis.in (the \u201CWebsite\u201D), submit an enquiry, or interact with us through any of our digital channels.",
    extra: "By using our Website or providing your information, you agree to the practices described in this Privacy Policy.",
  },
  {
    id: "information-we-collect",
    number: "02",
    title: "Information We Collect",
    text: "We may collect the following types of information:",
    cards: [
      {
        icon: "user",
        title: "Personal Information",
        text: "Such as name, phone number, email address, company name, location and other details submitted through enquiry forms or direct communication.",
      },
      {
        icon: "list",
        title: "Project Information",
        text: "Details related to your requirements, project type, project location, budget range and any other information you choose to share.",
      },
      {
        icon: "monitor",
        title: "Technical Information",
        text: "Such as IP address, browser type, device information, pages visited and time spent on the Website.",
      },
      {
        icon: "message",
        title: "Communication Data",
        text: "Information you provide when you contact us via email, phone or chat, including the content of your messages.",
      },
    ],
  },
  {
    id: "how-we-use",
    number: "03",
    title: "How We Use Your Information",
    text: "We use the information we collect to:",
    checkItems: [
      "Respond to your enquiries and provide relevant information.",
      "Understand your requirements and offer suitable solutions.",
      "Improve our products, services and website experience.",
      "Communicate with you regarding your projects, updates and offers (with your consent).",
      "Maintain internal records and ensure effective customer support.",
      "Comply with applicable legal and regulatory requirements.",
    ],
  },
  {
    id: "cookies",
    number: "04",
    title: "Cookies and Tracking Technologies",
    text: "We use cookies and similar tracking technologies to remember your preferences, keep your cart intact and understand how visitors use the site. You can disable cookies in your browser settings, though some features may not function correctly.",
  },
  {
    id: "data-sharing",
    number: "05",
    title: "Sharing of Information",
    text: "We do not sell your personal information. Data may be shared with trusted service providers — such as logistics partners, payment processors and analytics tools — strictly to the extent needed to deliver our services.",
    extra: "We may disclose information if required by law or to protect the rights and safety of ENSIS and our customers.",
  },
  {
    id: "data-security",
    number: "06",
    title: "Data Security",
    text: "We implement appropriate technical and organisational measures to protect your data against unauthorised access, alteration, disclosure or destruction.",
  },
  {
    id: "your-rights",
    number: "07",
    title: "Your Rights",
    text: "You may request access to, correction of or deletion of your personal data at any time by writing to us. We respond to verified requests within a reasonable period.",
    link: { href: "/contact", label: "Contact us to exercise your rights" },
  },
  {
    id: "third-party-links",
    number: "08",
    title: "Third-Party Links",
    text: "This Website may contain links to third-party websites for your convenience. We do not endorse or take responsibility for the content, privacy practices or policies of any third-party websites. Accessing such links is at your own risk.",
  },
  {
    id: "childrens-privacy",
    number: "09",
    title: "Children's Privacy",
    text: "Our Website and services are directed at businesses and adults. We do not knowingly collect personal information from children. If you believe a child has provided us with information, please contact us and we will delete it.",
  },
  {
    id: "policy-changes",
    number: "10",
    title: "Updates to This Policy",
    text: "We may update this Privacy Policy from time to time. The latest version will always be published on this page with an updated revision date.",
  },
  {
    id: "contact-us",
    number: "11",
    title: "Contact Us",
    text: "For any questions about this Privacy Policy or your personal data, reach out to our team:",
    bullets: [
      "Email: info@ensis.in",
      "Phone: +91 9654900525",
    ],
  },
];
