"use client";

import React from "react";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Accordion } from "../components/ui/Accordion";
import { FAQ_DATA } from "../constants/doctorData";

import { FAQItem } from "../types";

interface FAQSectionProps {
  faqs?: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs = FAQ_DATA }) => {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about scheduling consultations, clinic safety, and insurance coverage."
          align="center"
        />

        <div className="mt-12">
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  );
};
