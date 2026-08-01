"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ShieldCheck, Star, Award, HeartPulse } from "lucide-react";
import { Button } from "../components/ui/Button";
import { DOCTOR_PROFILE } from "../constants/doctorData";
import { useMouseParallax } from "../hooks/useMouseParallax";
import { generateMedicalSvgPlaceholder, DEFAULT_BLUR_DATA_URL } from "../lib/imagePlaceholders";
import {
  staggerContainerVariant,
  fadeUpVariant,
  heroPortraitVariant,
  floatingCardVariant,
} from "../animations/variants";

import { DoctorProfile } from "../types";

interface HeroSectionProps {
  doctor?: DoctorProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ doctor = DOCTOR_PROFILE }) => {
  const mousePosition = useMouseParallax(12);

  const defaultFallbackImage = "https://aavisstudio.com/wp-content/uploads/2026/07/farzana-khan-mohima.png";
  const heroDoctorImage = doctor.heroImage || defaultFallbackImage;

  const [imgSrc, setImgSrc] = React.useState(heroDoctorImage);

  React.useEffect(() => {
    setImgSrc(heroDoctorImage || defaultFallbackImage);
  }, [heroDoctorImage]);

  const renderDoctorPortrait = () => (
    <motion.div
      style={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-[4/5]"
    >
      {/* Main Doctor Image - Frameless */}
      <motion.div
        variants={heroPortraitVariant}
        className="w-full h-full relative rounded-[24px] overflow-hidden drop-shadow-xl"
      >
        <Image
          src={imgSrc}
          alt={`${doctor.name} - ${doctor.title}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 440px"
          className="object-cover object-top hover:scale-105 transition-transform duration-700"
          onError={() => setImgSrc(defaultFallbackImage)}
        />
      </motion.div>

      {/* Floating Card 1: Appointment Card (Top-Right) */}
      <motion.div
        variants={floatingCardVariant(0)}
        animate="animate"
        className="absolute -top-4 -right-2 sm:-right-6 p-3.5 sm:p-4 rounded-[20px] glass-panel shadow-xl flex items-center gap-3 border border-white/80 max-w-[200px] sm:max-w-[220px]"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex flex-col text-[11px] sm:text-xs">
          <span className="font-bold text-slate-900">Book Consultation</span>
          <span className="text-slate-500 font-medium">Mon-Fri • 8am-5pm</span>
        </div>
      </motion.div>

      {/* Floating Card 2: Experience Card (Bottom-Left) */}
      <motion.div
        variants={floatingCardVariant(1.5)}
        animate="animate"
        className="absolute -bottom-5 -left-2 sm:-left-8 p-3.5 sm:p-4 rounded-[20px] glass-panel shadow-xl flex items-center gap-3 border border-white/80 max-w-[190px] sm:max-w-[210px]"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex flex-col text-[11px] sm:text-xs">
          <span className="font-bold text-slate-900">4+ Yrs Experience</span>
          <span className="text-slate-500 font-medium">Dhaka Dental clinic</span>
        </div>
      </motion.div>

      {/* Floating Card 3: Patient Rating Card (Middle-Right) */}
      <motion.div
        variants={floatingCardVariant(0.7)}
        animate="animate"
        className="absolute top-1/2 -right-3 sm:-right-10 -translate-y-1/2 p-3 sm:p-3.5 rounded-[20px] glass-panel shadow-xl flex items-center gap-2.5 sm:gap-3 border border-white/80"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
          <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex flex-col text-[11px] sm:text-xs">
          <span className="font-bold text-slate-900">98.4% Success</span>
          <span className="text-slate-500 font-medium">Verified Reviews</span>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden mesh-bg"
    >
      {/* Background Animated Glow & Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] radial-glow pointer-events-none opacity-80" />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        className="absolute top-10 right-10 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          {/* Left Column — Text, Mobile Portrait, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* 1. Pill Badge */}
            <motion.div variants={fadeUpVariant}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase bg-blue-50 text-blue-600 border border-blue-200/80 shadow-xs mb-6">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Certified Dental Surgeon</span>
              </div>
            </motion.div>

            {/* 2. Main Headline */}
            <motion.h1
              variants={fadeUpVariant}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.12] tracking-tight mb-6"
            >
              Meet <span className="text-blue-600">Farzana</span> Mohima Dental Specialist
            </motion.h1>

            {/* 3. Subheadline */}
            <motion.p
              variants={fadeUpVariant}
              className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed mb-6 lg:mb-8 max-w-xl"
            >
              Trusted care for every step of your teeth health journey.
            </motion.p>

            {/* 4. MOBILE PORTRAIT IMAGE (Visible right after hero texts on phone view) */}
            <div className="w-full lg:hidden my-6 sm:my-8 flex justify-center">
              {renderDoctorPortrait()}
            </div>

            {/* 5. CTA Buttons (Visible after image on phone view) */}
            <motion.div
              variants={fadeUpVariant}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
            >
              <Link href="#appointment">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Calendar className="w-5 h-5" />}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Get Appointment
                </Button>
              </Link>

              <Link href="#about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Doctor Profile
                </Button>
              </Link>
            </motion.div>

            {/* 6. Trust Avatar Badge */}
            <motion.div
              variants={fadeUpVariant}
              className="flex items-center gap-4 p-3 pr-6 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs"
            >
              <div className="flex -space-x-2.5 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700"
                  >
                    P{i}
                  </div>
                ))}
              </div>
              <div className="flex flex-col text-xs">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-slate-900 ml-1">4.9/5</span>
                </div>
                <span className="text-slate-500 font-medium">
                  Trusted by 5,400+ satisfied patients
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column — DESKTOP PORTRAIT IMAGE (Visible on lg screens) */}
          <div className="hidden lg:flex lg:col-span-5 relative justify-center items-center">
            {renderDoctorPortrait()}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
