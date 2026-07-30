"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  Send,
  CheckCircle2,
} from "lucide-react";
import { DOCTOR_PROFILE } from "../../constants/doctorData";
import { Button } from "../ui/Button";

import { DoctorProfile } from "../../types";

interface FooterProps {
  doctor?: DoctorProfile;
}

export const Footer: React.FC<FooterProps> = ({ doctor = DOCTOR_PROFILE }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 lg:pt-20 pb-12 border-t border-slate-800 relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-slate-800">
          {/* Column 1: Brand & Newsletter */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg tracking-tight">
                  {doctor.name}
                </span>
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider line-clamp-1">
                  {doctor.title}
                </span>
              </div>
            </div>

            {/* <p className="text-sm text-slate-400 leading-relaxed"> */}
              Provide best treatment for patient

            {/* Newsletter Form */}
            {/* <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2">
              <label htmlFor="newsletter-email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Subscribe to Health Tips & Updates
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-slate-800/90 text-white placeholder:text-slate-500 rounded-full px-4 py-2.5 text-xs w-full outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed successfully!
                </span>
              )}
            </form> */}
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[
                { name: "About Dr.Farzana", href: "#about" },
                { name: "Specialties & Expertise", href: "#specialties" },
                { name: "Services", href: "#services" },
                // { name: "Education & Career", href: "#timeline" },
                // { name: "Patient Reviews", href: "#testimonials" },
                // { name: "Clinic Gallery", href: "#gallery" },
                // { name: "Health Articles", href: "#blog" },
                { name: "Book Consultation", href: "#appointment" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-blue-400 transition-colors text-slate-400 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Schedule Hours */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Working Hours
            </h3>
            <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-400">
              {doctor.workingHours.map((wh) => (
                <div key={wh.days} className="flex flex-col pb-2 border-b border-slate-800/80">
                  <span className="font-semibold text-slate-200">{wh.days}</span>
                  <span className="text-blue-400 font-medium">{wh.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Clinic Contact
            </h3>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span>
                  {doctor.location.address}, {doctor.location.city},{" "}
                  {doctor.location.state} {doctor.location.zip}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${doctor.contact.phone}`} className="hover:text-white transition-colors">
                  {doctor.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${doctor.contact.email}`} className="hover:text-white transition-colors">
                  {doctor.contact.email}
                </a>
              </div>
            </div>

            {/* Quick Emergency Badge */}
            <div className="mt-2 p-3 rounded-xl bg-blue-950/60 border border-blue-800/50 text-xs text-blue-300">
              <span className="font-bold text-white block">24/7 Emergency Line:</span>
              <span>{doctor.contact.emergencyPhone}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {doctor.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>A product of Aavis It & Care</span>
           
           
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-2"
              aria-label="Scroll back to top of page"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
