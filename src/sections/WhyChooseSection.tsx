"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Heart,
  DollarSign,
  Award,
  Users,
} from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Card } from "../components/ui/Card";
import { fadeUpVariant } from "../animations/variants";

const WHY_CHOOSE_ITEMS = [
  {
    title: "Evidence-Based Treatment",
    desc: "All clinical management plans follow American College of Cardiology guidelines.",
    icon: ShieldCheck,
  },
  {
    title: "Modern Equipment",
    desc: "Ultra-low dose fluoroscopy and 3D digital color Doppler ultrasound.",
    icon: Cpu,
  },
  {
    title: "Patient-First Care",
    desc: "Acoustic private consultation suites designed for compassionate listening.",
    icon: Heart,
  },
  {
    title: "Transparent & Affordable",
    desc: "Direct insurance verification with clear, zero-hidden-fee pricing options.",
    icon: DollarSign,
  },
  {
    title: "Ethical Practice",
    desc: "Zero unnecessary interventional procedures — absolute medical integrity.",
    icon: Award,
  },
  {
    title: "Experienced Specialist",
    desc: "16+ years of interventional mastery with over 5,400 successful procedures.",
    icon: Users,
  },
];

export const WhyChooseSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-white relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Why Choose Us"
          title="Why Patients Trust Dr. Marcus Vance"
          subtitle="Combining high-precision cardiac medicine with a warm, patient-centered clinic experience."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {WHY_CHOOSE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <Card className="h-full flex flex-col justify-start p-6 lg:p-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
