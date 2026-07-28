"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS_DATA } from "../constants/doctorData";
import { DEFAULT_BLUR_DATA_URL } from "../lib/imagePlaceholders";

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-800/60 mb-3">
              <span>● Patient Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              WHAT OUR PATIENTS SAY ABOUT US
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-400">
              700+ Verified Patient Reviews
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={prevTestimonial}
                aria-label="Previous patient testimonial"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                aria-label="Next patient testimonial"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial Card Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-800/60 p-8 sm:p-12 rounded-[24px] border border-slate-700/60 shadow-2xl"
          >
            {/* Left Patient Photo */}
            <div className="lg:col-span-4 relative aspect-square rounded-[20px] overflow-hidden bg-slate-700 max-w-xs mx-auto lg:max-w-none">
              <Image
                src={current.patientAvatar}
                alt={current.patientName}
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                placeholder="blur"
                blurDataURL={DEFAULT_BLUR_DATA_URL}
                className="object-cover"
              />
            </div>

            {/* Right Quote & Details */}
            <div className="lg:col-span-8 flex flex-col justify-between items-start">
              <Quote className="w-12 h-12 text-blue-500/40 mb-4" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                {current.verifiedGoogleReview && (
                  <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    Verified Google Review
                  </span>
                )}
              </div>

              <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 leading-relaxed font-medium mb-8">
                &quot;{current.reviewText}&quot;
              </p>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {current.patientName}
                </h3>
                <span className="text-xs text-blue-400 font-semibold block">
                  {current.patientRoleOrCondition} • {current.date}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
