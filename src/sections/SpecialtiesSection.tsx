"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Stethoscope, Heart, ArrowRight } from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Card } from "../components/ui/Card";
import { SPECIALTIES_DATA } from "../constants/doctorData";
import { fadeUpVariant } from "../animations/variants";
import { Specialty } from "../types";

const ICON_MAP: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-6 h-6 text-blue-600" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-blue-600" />,
  Stethoscope: <Stethoscope className="w-6 h-6 text-blue-600" />,
  Heart: <Heart className="w-6 h-6 text-blue-600" />,
};

interface SpecialtiesSectionProps {
  specialties?: Specialty[];
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({ specialties = SPECIALTIES_DATA }) => {
  return (
    <section id="specialties" className="py-20 lg:py-32 bg-white relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Medical Specialties"
          title="Expert Medical Care Across Core Cardiovascular Disciplines"
          subtitle="Providing comprehensive prevention, non-invasive diagnostics, and catheter-based interventional therapies."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
          {specialties.map((spec) => (
            <motion.div
              key={spec.id}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              <Card className="h-full flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                    {ICON_MAP[spec.iconName]}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {spec.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {spec.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Key Procedures:
                    </span>
                    <ul className="flex flex-col gap-1.5">
                      {spec.treatments.map((t) => (
                        <li key={t} className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href="#appointment"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider group"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
