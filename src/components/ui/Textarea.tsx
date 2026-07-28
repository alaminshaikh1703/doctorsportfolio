import React, { useId } from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
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
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-4 text-sm font-medium border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none min-h-[120px] resize-y",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
