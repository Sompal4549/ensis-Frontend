// Options shown in selects / checkboxes / radios

export interface SelectOption {
  value: string;
  label: string;
}

export interface CheckboxOption {
  id: string;
  label: string;
}

export interface RadioOption {
  id: string;
  label: string;
}

export interface WhyChooseItem {
  id: string;
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
}

export interface EnquiryPageContent {
  hero: {
    heading: string;
    subheading: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    formImageSrc:string
    ctaPrimary: {
      label: string;
      href: string;
    };
    ctaSecondary: {
      label: string;
      href: string;
    };
    trustIndicators: {
      id: string;
      label: string;
    }[];
  };
  formTitle: string;
  projectTypeOptions: SelectOption[];
  stateOptions: SelectOption[];
  cityOptions: SelectOption[];
  projectSizeOptions: SelectOption[];
  budgetRangeOptions: SelectOption[];
  timelineOptions: SelectOption[];
  servicesOptions: CheckboxOption[];
  preferredContactOptions: RadioOption[];
  whyChoose: {
    heading: string;
    items: WhyChooseItem[];
    bottomImageSrc: string;
    bottomImageAlt: string;
  };
  upload: {
    label: string;
    helperText: string;
  };
  consentText: string;
  submitButtonText: string;
}

// Form data state shape

export interface EnquiryFormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  companyOrganization: string;
  cityAndState: string;
  projectType: string;
  state: string;
  city: string;
  projectSize: string;
  budgetRange: string;
  servicesRequired: string[];
  timeline: string;
  message: string;
  file: File | null;
  preferredContact: string;
  agreeToContact: boolean;
}

export type EnquiryFormErrors = Partial<Record<keyof EnquiryFormData, string>>;