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
    title: "Personalized Treatment",
    desc: "Every treatment plan is customized according to your oral health needs.",
    icon: ShieldCheck,
  },
  {
    title: "Gentle Dental Care",
    desc: "Comfortable and pain-conscious dental treatment for patients of all ages.",
    icon: Cpu,
  },
  {
    title: "Modern Clinical Techniques",
    desc: "Evidence-based dentistry with updated clinical approaches.",
    icon: Heart,
  },
  // {
  //   title: "Honest Consultation",
  //   desc: "Clear explanation of treatment options before every procedure.",
  //   icon: Award,
  // },
  // {
  //   title: "Preventive Focus",
  //   desc: "Helping patients prevent dental problems before they become serious.",
  //   icon: Award,
  // },
  // {
  //   title: "Ethical Practice",
  //   desc: "Treatments recommended only when clinically necessary.",
  //   icon: Users,
  // },
];

export const WhyChooseSection: React.FC = () => {
  return (
    <section id="specialties" className="py-20 lg:py-32 bg-white relative scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Why Choose me"
          title="Why Patients Trust Dr. Farzana Khan Mohima"
          subtitle="Trusted Dental Care With Modern Treatment & Compassionate Approach"
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
