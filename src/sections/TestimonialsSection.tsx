"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { TESTIMONIALS_DATA } from "../constants/doctorData";
import { PatientTestimonial } from "../types";
import { fadeUpVariant } from "../animations/variants";

interface TestimonialsSectionProps {
  testimonials?: PatientTestimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials: rawTestimonials = TESTIMONIALS_DATA,
}) => {
  const testimonials = Array.isArray(rawTestimonials) && rawTestimonials.length > 0 ? rawTestimonials : TESTIMONIALS_DATA;
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Get current slice of 3 items for responsive card layout
  const visibleTestimonials = Array.from({ length: Math.min(itemsPerPage, testimonials.length) }).map(
    (_, i) => testimonials[(startIndex + i) % testimonials.length]
  );

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-slate-50/70 border-y border-slate-200/80 relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Title and Aggregate Google Rating */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionTitle
              label="Patient Reviews"
              title="Verified Patient Experiences"
              subtitle="Real stories from patients treated with high medical precision, compassion, and surgical care."
              align="left"
              className="mb-0 max-w-2xl"
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Aggregate Score Badge */}
            <div className="hidden sm:flex items-center gap-3 bg-white px-4 py-2.5 rounded-full border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">4.9 / 5.0</span>
              <span className="text-xs text-slate-500 font-medium">(742+ Reviews)</span>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-xs"
                aria-label="Previous Testimonials"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-xs"
                aria-label="Next Testimonials"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((item, index) => {
              const ratingCount = Math.max(1, Math.min(5, Math.floor(Number(item?.rating) || 5)));
              return (
                <motion.div
                  key={item?.id || index}
                  variants={fadeUpVariant}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col justify-between h-full relative"
                >
                  {/* Top Quote Icon & Rating */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(ratingCount)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {item?.verifiedGoogleReview && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          Verified Google Review
                        </span>
                      )}
                    </div>

                    {/* Review Text */}
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium mb-6 italic">
                      &quot;{item?.reviewText}&quot;
                    </p>
                  </div>

                  {/* Bottom Patient Author Block */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                    <div className="w-11 h-11 rounded-full overflow-hidden relative bg-blue-100 shrink-0 border border-slate-200">
                      {item?.patientAvatar ? (
                        <Image
                          src={item.patientAvatar}
                          alt={item.patientName || "Patient"}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-sm">
                          {item?.patientName ? item.patientName.charAt(0) : "P"}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {item?.patientName}
                      </span>
                      <span className="text-xs text-slate-500 font-medium truncate">
                        {item?.patientRoleOrCondition} • {item?.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
