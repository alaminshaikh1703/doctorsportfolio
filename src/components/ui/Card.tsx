"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { cardHoverVariant } from "../../animations/variants";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  gradientBorder?: boolean;
  glass?: boolean;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  gradientBorder = true,
  glass = false,
  hoverEffect = true,
  className,
  ...props
}) => {
  return (
    <motion.div
      variants={hoverEffect ? cardHoverVariant : undefined}
      initial="rest"
      whileHover={hoverEffect ? "hover" : undefined}
      className={cn(
        "rounded-[20px] p-6 lg:p-8 bg-white border border-slate-200/80 shadow-md transition-all duration-300 relative overflow-hidden",
        gradientBorder && "gradient-border-card",
        glass && "glass-panel",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
