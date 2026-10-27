"use client";

import React from "react";

export interface PremiumMapProps {
  mapUrl?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  directionsUrl?: string;
  leafImage?: string;
}

/**
 * PremiumMap component:
 * The interactive "Find Us on Map" banner has been unified directly into ContactSection
 * to match the design with the 3-card grid and decorative botanical cutouts.
 */
const PremiumMap: React.FC<{ sectionContent?: PremiumMapProps }> = () => {
  return null;
};

export default PremiumMap;