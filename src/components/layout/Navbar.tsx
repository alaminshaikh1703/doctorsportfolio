"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Stethoscope, PhoneCall, Menu, X, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { DOCTOR_PROFILE } from "../../constants/doctorData";
import { cn } from "../../lib/utils";
import { DoctorProfile } from "../../types";

const NAV_LINKS = [
  { name: "Home", href: "/#hero", sectionId: "hero" },
  { name: "About", href: "/#about", sectionId: "about" },
  { name: "Specialties", href: "/#specialties", sectionId: "specialties" },
  { name: "Services", href: "/#services", sectionId: "services" },
  { name: "Experience", href: "/#timeline", sectionId: "timeline" },
  { name: "Blog", href: "/blog", sectionId: "blog" },
];

interface NavbarProps {
  doctor?: DoctorProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ doctor = DOCTOR_PROFILE }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section scroll spy tracking on homepage
      if (!pathname || pathname === "/") {
        const sections = ["hero", "about", "specialties", "services", "timeline"];
        const scrollPosition = window.scrollY + 180;

        for (let i = sections.length - 1; i >= 0; i--) {
          const sectionId = sections[i];
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top - 80) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      } else if (pathname.startsWith("/blog")) {
        setActiveSection("blog");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled || (pathname && pathname !== "/")
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand / Doctor Name */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg p-1 min-w-0 shrink"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 max-w-[200px] sm:max-w-[260px] md:max-w-[320px]">
            <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight truncate">
              {doctor.name}
            </span>
            <span className="text-[11px] text-blue-600 font-semibold tracking-wide uppercase truncate hidden sm:block">
              {doctor.title}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items with Ultra Smooth Pill Sliding */}
        <LayoutGroup id="navbar-pill-group">
          <nav className="hidden lg:flex items-center gap-1 shrink-0 relative bg-slate-100/60 p-1 rounded-full border border-slate-200/50">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.sectionId === "blog"
                  ? pathname && pathname.startsWith("/blog")
                  : pathname === "/" && activeSection === link.sectionId;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveSection(link.sectionId)}
                  className={cn(
                    "relative text-xs xl:text-sm font-bold transition-colors duration-200 whitespace-nowrap rounded-full px-4 py-1.5 cursor-pointer select-none",
                    isActive
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-blue-600"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white border border-slate-200/90 rounded-full -z-10 shadow-xs"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 32,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>

        {/* Desktop CTA & Phone */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <a
            href={`tel:${doctor.contact.phone}`}
            className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors bg-slate-100/80 hover:bg-blue-50 px-3.5 py-2 rounded-full border border-slate-200/60 whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>{doctor.contact.phone}</span>
          </a>

          <Link href="/#appointment">
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
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 shrink-0"
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
            className="lg:hidden bg-white border-b border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="max-w-md mx-auto px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.sectionId);
                    setMobileMenuOpen(false);
                  }}
                  className="text-base font-semibold text-slate-800 hover:text-blue-600 py-2 border-b border-slate-100"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <a
                  href={`tel:${doctor.contact.phone}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-full bg-slate-100 text-slate-800 font-semibold text-sm"
                >
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <span>Call {doctor.contact.phone}</span>
                </a>
                <Link href="/#appointment" onClick={() => setMobileMenuOpen(false)}>
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
