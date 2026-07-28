"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { ANIMATION_TOKENS } from "../../constants/tokens";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-[20px] bg-white border border-slate-200/80 shadow-xs overflow-hidden transition-colors"
          >
            <button
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 rounded-[20px]"
            >
              <span className="text-base sm:text-lg font-bold text-slate-900 pr-4">
                {item.question}
              </span>
              <div
                className={cn(
                  "p-2 rounded-full bg-slate-100 text-slate-600 transition-transform duration-250 shrink-0",
                  isOpen && "bg-blue-600 text-white rotate-180"
                )}
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: ANIMATION_TOKENS.duration.fast, // 0.25s
                    ease: ANIMATION_TOKENS.ease.cubic,
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-0 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 mt-1 pt-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
