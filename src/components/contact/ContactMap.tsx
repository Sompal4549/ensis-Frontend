"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { Container } from "../ui/Container";

const PremiumMap: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Container>
        {/* Heading */}
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <MapPin className="h-4 w-4" />
            Visit Our Location
          </span>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
            Visit our office and experience our premium services in person.
          </p>
        </div>

        {/* Map Card */}
        <div className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-3 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          {/* Glow Effect */}
          <div className="absolute -left-24 -top-24 h-52 w-52 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-52 w-52 rounded-full bg-sky-200/40 blur-3xl" />

          {/* Floating Badge */}
          <div className="absolute left-6 top-6 z-20 rounded-2xl bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-500">Location</p>
                <h3 className="font-semibold text-slate-900">
                  Ensis Delhi NCR
                </h3>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-[28px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.2746915829944!2d77.3887281!3d28.681428499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf1ead9e1d9e5%3A0x31a2384cd903039b!2sEnsis%20(Best%20Ayurvedic%2C%20Spa%20%26%20Panchkarma%20Equipment%20Manufacturer%20in%20Delhi%20NCR)!5e0!3m2!1sen!2sin!4v1782531781304!5m2!1sen!2sin"
              className="h-[500px] w-full transition duration-500 group-hover:scale-[1.01]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PremiumMap;