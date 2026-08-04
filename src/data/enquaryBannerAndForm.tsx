import { EnquiryPageContent } from "@/types/enquary/enquaryBannerAndForm";
import bannerImage from "@/assets/home/home_banner2.webp"
export const fallbackEnquiryContent: EnquiryPageContent = {
  hero: {
    formImageSrc:"",
    heading: "Enquiry",
    subheading: "Let's Build Your Wellness Vision.",
    description:
      "Tell us about your project, and our experts will connect with you to create a wellness space that reflects your vision.",
    imageSrc: bannerImage.src,
    imageAlt: "Wooden Ayurvedic massage table with brass hanging diya in a spa setting",
    ctaPrimary: {
      label: "Start Your Project",
      href: "#enquiry-form",
    },
    ctaSecondary: {
      label: "Book Free Consultation",
      href: "/consultancy",
    },
    trustIndicators: [
      { id: "confidential", label: "100% Confidential" },
      { id: "guidance", label: "Expert Guidance" },
      { id: "obligation", label: "No Obligation" },
    ],
  },
  formTitle: "Enquiry Form",
  projectTypeOptions: [
    { value: "ayurveda-resort", label: "Ayurveda Resort" },
    { value: "spa-wellness-center", label: "Spa & Wellness Center" },
    { value: "panchakarma-clinic", label: "Panchakarma Clinic" },
    { value: "wellness-hospital", label: "Wellness Hospital" },
    { value: "other", label: "Other" },
  ],
  stateOptions: [
    { value: "kerala", label: "Kerala" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "karnataka", label: "Karnataka" },
    { value: "goa", label: "Goa" },
    { value: "uttarakhand", label: "Uttarakhand" },
  ],
  cityOptions: [
    { value: "city-1", label: "City 1" },
    { value: "city-2", label: "City 2" },
    { value: "city-3", label: "City 3" },
  ],
  projectSizeOptions: [
    { value: "small", label: "Small (under 2,000 sq.ft.)" },
    { value: "medium", label: "Medium (2,000 - 10,000 sq.ft.)" },
    { value: "large", label: "Large (10,000+ sq.ft.)" },
  ],
  budgetRangeOptions: [
    { value: "under-10l", label: "Under ₹10 Lakhs" },
    { value: "10l-50l", label: "₹10 Lakhs - ₹50 Lakhs" },
    { value: "50l-1cr", label: "₹50 Lakhs - ₹1 Crore" },
    { value: "above-1cr", label: "Above ₹1 Crore" },
  ],
  timelineOptions: [
    { value: "immediate", label: "Immediate" },
    { value: "1-3-months", label: "1 - 3 Months" },
    { value: "3-6-months", label: "3 - 6 Months" },
    { value: "6-plus-months", label: "6+ Months" },
  ],
  servicesOptions: [
    { id: "consultation", label: "Consultation" },
    { id: "turnkey-execution", label: "Turnkey Execution" },
    { id: "planning", label: "Planning" },
    { id: "project-management", label: "Project Management" },
    { id: "design", label: "Design" },
    { id: "after-sales-support", label: "After Sales Support" },
    { id: "equipment-supply", label: "Equipment Supply" },
  ],
  preferredContactOptions: [
    { id: "phone", label: "Phone" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "email", label: "Email" },
    { id: "video-meeting", label: "Video Meeting" },
  ],
  whyChoose: {
    heading: "Why Choose ENSIS",
    bottomImageSrc: "/images/enquiry/why-choose-bottom.jpg",
    bottomImageAlt: "Brass kalash and herbal potli with marigold flower and green towel",
    items: [
      {
        id: "years-of-trust",
        iconSrc: "/images/enquiry/icon-shield.svg",
        iconAlt: "Shield icon representing years of trust",
        title: "20+ Years of Trust",
        description: "Two decades of excellence in wellness industry",
      },
      {
        id: "projects-delivered",
        iconSrc: "/images/enquiry/icon-lotus.svg",
        iconAlt: "Lotus icon representing projects delivered",
        title: "1000+ Projects Delivered",
        description: "Successfully executed wellness projects",
      },
      {
        id: "pan-india-presence",
        iconSrc: "/images/enquiry/icon-location.svg",
        iconAlt: "Location pin icon representing pan India presence",
        title: "Pan India Presence",
        description: "Serving clients across the length & breadth of India",
      },
      {
        id: "dedicated-support",
        iconSrc: "/images/enquiry/icon-support.svg",
        iconAlt: "People icon representing dedicated project support",
        title: "Dedicated Project Support",
        description: "End-to-end support, before, during & after project delivery",
      },
    ],
  },
  upload: {
    label: "Upload Floor Plan / Documents",
    helperText: "Accepted: PDF, JPG, PNG, DOC",
  },
  consentText: "I agree to be contacted by ENSIS regarding my enquiry.",
  submitButtonText: "Submit Enquiry",
};