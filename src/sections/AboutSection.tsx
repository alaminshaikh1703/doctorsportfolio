"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Button } from "../components/ui/Button";
import { DOCTOR_PROFILE } from "../constants/doctorData";
import { generateMedicalSvgPlaceholder, DEFAULT_BLUR_DATA_URL } from "../lib/imagePlaceholders";
import { fadeUpVariant } from "../animations/variants";

import { DoctorProfile } from "../types";

interface AboutSectionProps {
  doctor?: DoctorProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ doctor = DOCTOR_PROFILE }) => {
  const aboutDoctorImage = doctor.aboutImage || generateMedicalSvgPlaceholder(
    `${doctor.name} in Consultation`,
    "Patient Dialogue & Clinical Suite",
    "consultation"
  );

  return (
    <section id="about" className="py-20 lg:py-32 bg-slate-50/50 relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="About Doctor"
          title="Supporting Your Health At Every Stage Of Life"
          subtitle="Committed to individualized cardiovascular care, evidence-based treatment protocols, and medical excellence."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mt-12">
          {/* Left Column — Clinic & Doctor Image Layout */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-white p-3 shadow-xl border border-slate-200/80">
              <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                <Image
                  src={aboutDoctorImage}
                  alt={doctor.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  placeholder="blur"
                  blurDataURL={DEFAULT_BLUR_DATA_URL}
                  className="object-cover"
                  unoptimized={typeof aboutDoctorImage === 'string' && aboutDoctorImage.startsWith("data:")}
                />
              </div>

              {/* Floating Certification Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-[20px] glass-panel shadow-lg border border-white/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-slate-900">FACC Accredited Fellow</span>
                    <span className="text-slate-500 font-medium">American College of Cardiology</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column — Bio & Highlights */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-4">
              Pioneering Human-Centric Cardiovascular Medicine
            </h3>

            <p className="text-base text-slate-600 leading-relaxed mb-6">
              {doctor.bio}
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="p-5 rounded-[20px] bg-white border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                  Our Mission
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {doctor.mission}
                </p>
              </div>

              <div className="p-5 rounded-[20px] bg-white border border-slate-200/80 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                  Our Vision
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {doctor.vision}
                </p>
              </div>
            </div>

            {/* Key Bullet Points (Matching Reference) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
              {[
                { title: "100% Secure & Confidential", desc: "Strict HIPAA compliance & private suites", icon: ShieldCheck },
                { title: "Award-winning Healthcare", desc: "Top National Cardiology Recognition 2023", icon: Award },
                { title: "24/7 Expert Support", desc: "Direct patient portal & emergency line", icon: Clock },
                { title: "Evidence-Based Treatment", desc: "Customized clinical care pathways", icon: CheckCircle2 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{item.title}</span>
                      <span className="text-xs text-slate-500">{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="#timeline">
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Doctor Credentials & Timeline
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
