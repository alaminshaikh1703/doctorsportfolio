"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Briefcase, Medal } from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { TIMELINE_DATA } from "../constants/doctorData";
import { fadeUpVariant } from "../animations/variants";

import { TimelineItem } from "../types";

interface TimelineSectionProps {
  timeline?: TimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline = TIMELINE_DATA }) => {
  return (
    <section id="timeline" className="py-20 lg:py-32 bg-slate-50/60 relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Education & Experience"
          title="A Distinguished Career in Cardiovascular Medicine"
          subtitle="Trained at Johns Hopkins and Harvard institutions, backed by board certifications and national clinical awards."
          align="center"
        />

        <div className="relative mt-16 max-w-4xl mx-auto">
          {/* Central Vertical Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 -translate-x-1/2 hidden md:block" />
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200 md:hidden" />

          <div className="flex flex-col gap-10">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={item.id}
                  variants={fadeUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Dot Marker */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white border-4 border-white shadow-md flex items-center justify-center z-10">
                    {item.type === "education" && <GraduationCap className="w-3.5 h-3.5" />}
                    {item.type === "award" && <Medal className="w-3.5 h-3.5" />}
                    {item.type === "position" && <Briefcase className="w-3.5 h-3.5" />}
                    {(item.type === "residency" || item.type === "fellowship") && (
                      <Award className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Card Container */}
                  <div className="w-full md:w-[calc(50%-2rem)] pl-12 md:pl-0">
                    <div className="p-6 rounded-[20px] bg-white border border-slate-200/80 shadow-md hover:shadow-lg transition-shadow">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <span className="text-xs font-semibold text-blue-600 block mb-2">
                        {item.institution} • {item.degreeOrRole}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
