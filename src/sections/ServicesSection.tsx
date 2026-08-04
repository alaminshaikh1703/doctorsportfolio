"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SERVICES_DATA } from "../constants/doctorData";
import { generateMedicalSvgPlaceholder } from "../lib/imagePlaceholders";
import { fadeUpVariant } from "../animations/variants";
import { MedicalService } from "../types";

interface ServicesSectionProps {
  services?: MedicalService[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = SERVICES_DATA,
}) => {
  return (
    <section id="services" className="py-20 lg:py-32 bg-white relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Clinical Excellence"
          title="Specialized Surgical & Dental Services"
          subtitle="Comprehensive, state-of-the-art procedures designed with ultra-low invasive technology."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {services.map((serv) => {
            const imageSrc =
              typeof serv?.image === "string" && serv.image.trim() !== ""
                ? serv.image
                : generateMedicalSvgPlaceholder(serv?.title || "Clinical Service", "Dental Specialist", "clinic");

            return (
              <motion.div
                key={serv.id}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <Card className="h-full flex flex-col md:flex-row gap-6 p-6 lg:p-8 bg-white">
                  {/* Image Container */}
                  <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto rounded-[16px] overflow-hidden shrink-0 bg-slate-100">
                    <Image
                      src={imageSrc}
                      alt={serv.title || "Service Image"}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-blue-600 shadow-xs">
                      {serv.category}
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900 leading-snug">
                          {serv.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{serv.estimatedDuration}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {serv.shortDescription}
                      </p>

                      <ul className="flex flex-col gap-1.5 mb-6">
                        {serv.keyBenefits?.map((b) => (
                          <li key={b} className="text-xs text-slate-700 font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href="#appointment">
                      <Button
                        variant="subtle"
                        size="sm"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="w-full justify-between"
                      >
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
