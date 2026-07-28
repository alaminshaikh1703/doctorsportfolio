"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { buttonTapVariant } from "../../animations/variants";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "subtle" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-250 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg shadow-blue-500/20 active:bg-blue-800",
    outline:
      "bg-white/80 hover:bg-white text-slate-800 border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md",
    subtle:
      "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100",
    dark:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg shadow-slate-900/20",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-blue-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs gap-1.5 min-h-[38px]",
    md: "px-6 py-3 text-sm gap-2 min-h-[46px]",
    lg: "px-8 py-4 text-base gap-2.5 min-h-[54px]",
  };

  return (
    <motion.button
      variants={buttonTapVariant}
      whileHover="hover"
      whileTap="tap"
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </motion.button>
  );
};
