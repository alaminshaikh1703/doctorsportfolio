import React from "react";
import { cn } from "../../lib/utils";

interface SectionLabelProps {
  text: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ text, className }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-50 text-blue-600 border border-blue-100/80 shadow-xs mb-3",
        className
      )}
    >
      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
};
