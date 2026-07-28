"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, PhoneCall, Menu, X, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { DOCTOR_PROFILE } from "../../constants/doctorData";
import { cn } from "../../lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Specialties", href: "#specialties" },
  { name: "Services", href: "#services" },
  { name: "Experience", href: "#timeline" },
  // { name: "Testimonials", href: "#testimonials" },
  // { name: "Gallery", href: "#gallery" },
  { name: "Blog", href: "#blog" },
  // { name: "FAQ", href: "#faq" },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Doctor Name */}
        <Link
          href="#hero"
          className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
              Dr. Farzana Mohima
            </span>
            <span className="text-xs text-blue-600 font-semibold tracking-wide uppercase">
              Dental Specialist
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden xl:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 rounded-md px-1 py-0.5"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Phone */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href={`tel:${DOCTOR_PROFILE.contact.phone}`}
            className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors bg-slate-100/80 hover:bg-blue-50 px-3.5 py-2 rounded-full border border-slate-200/60"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>{DOCTOR_PROFILE.contact.phone}</span>
          </a>

          <Link href="#appointment">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Book Appointment
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded.xl text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
          aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="xl:hidden bg-white border-b border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="max-w-md mx-auto px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-800 hover:text-blue-600 py-2 border-b border-slate-100"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <a
                  href={`tel:${DOCTOR_PROFILE.contact.phone}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-full bg-slate-100 text-slate-800 font-semibold text-sm"
                >
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <span>Call {DOCTOR_PROFILE.contact.phone}</span>
                </a>
                <Link href="#appointment" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Book Appointment Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
