"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { transitionSnappy } from "@/lib/motion";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedToggleProps<T extends string> {
  label: string;
  value: T;
  options: [SegmentedOption<T>, SegmentedOption<T>];
  onChange: (value: T) => void;
}

export function SegmentedToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedToggleProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-xl border border-border bg-card p-1 backdrop-blur-xl"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
              isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`segmented-toggle-${label}`}
                transition={transitionSnappy}
                className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-b from-accent-soft to-accent"
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
