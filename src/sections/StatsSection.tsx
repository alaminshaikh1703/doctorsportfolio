"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Award, HeartPulse, Clock } from "lucide-react";
import { AnimatedCounter } from "../components/ui/AnimatedCounter";
import { STATISTICS_DATA } from "../constants/doctorData";
import { fadeUpVariant } from "../animations/variants";

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users className="w-6 h-6 text-blue-600" />,
  Award: <Award className="w-6 h-6 text-blue-600" />,
  HeartPulse: <HeartPulse className="w-6 h-6 text-blue-600" />,
  Clock: <Clock className="w-6 h-6 text-blue-600" />,
};

import { StatisticItem } from "../types";

interface StatsSectionProps {
  statistics?: StatisticItem[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ statistics = STATISTICS_DATA }) => {
  return (
    <section className="py-12 bg-white border-y border-slate-200/80 relative z-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Tagline */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Trusted Care for Every Step of Your Health Journey
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Consistently rated among the top cardiovascular practices in NY.
            </p>
          </div>

          {/* Right Stats Bar */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {statistics.map((stat) => (
              <motion.div
                key={stat.id}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="flex flex-col items-start p-4 rounded-[20px] bg-slate-50/80 border border-slate-100 hover:border-blue-200 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mb-3">
                  {ICON_MAP[stat.iconName]}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  <AnimatedCounter
                    value={stat.numericValue}
                    suffix={stat.suffix}
                    decimals={stat.numericValue % 1 !== 0 ? 1 : 0}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                  {stat.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
