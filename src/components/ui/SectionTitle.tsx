import React from "react";
import { SectionLabel } from "./SectionLabel";
import { SectionTitleProps } from "../../types";
import { cn } from "../../lib/utils";

export const SectionTitle: React.FC<SectionTitleProps> = ({
  label,
  title,
  subtitle,
  align = "center",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col mb-12 lg:mb-16",
        align === "center" ? "items-center text-center max-w-3xl mx-auto" : "items-start text-left max-w-2xl",
        className
      )}
    >
      <SectionLabel text={label} />
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};
