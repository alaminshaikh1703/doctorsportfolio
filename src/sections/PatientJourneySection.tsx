"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Stethoscope, Microscope, HeartPulse, Smile } from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { fadeUpVariant } from "../animations/variants";

const JOURNEY_STEPS = [
  { step: 1, title: "Book", desc: "Select preferred slot online or call clinic", icon: CalendarCheck },
  { step: 2, title: "Consult", desc: "Detailed 60-min private dialogue with Dr. Vance", icon: Stethoscope },
  { step: 3, title: "Diagnosis", desc: "3D Echo or ECG precision diagnostics", icon: Microscope },
  { step: 4, title: "Treatment", desc: "Personalized medical or interventional care", icon: HeartPulse },
  { step: 5, title: "Recovery", desc: "Continuous patient portal monitoring & rehab", icon: Smile },
];

export const PatientJourneySection: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-white relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Patient Journey"
          title="Seamless 5-Step Clinical Care Process"
          subtitle="From your initial consultation to long-term cardiac wellness — transparent, simple, and supportive."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12 relative">
          {JOURNEY_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="flex flex-col items-center text-center p-6 rounded-[20px] bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors relative"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-blue-500/20 relative">
                  <Icon className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-extrabold border-2 border-white">
                    0{item.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
