import React, { useId } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-700 select-none"
        >
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm font-medium border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
