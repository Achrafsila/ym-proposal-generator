import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-border bg-white/[0.03] px-3.5 py-2.5 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-accent/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-accent/25",
          className
        )}
        {...props}
      />
    );
  }
);
