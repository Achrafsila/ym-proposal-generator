import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ToggleFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const ToggleField = forwardRef<HTMLInputElement, ToggleFieldProps>(function ToggleField(
  { label, description, className, ...props },
  ref
) {
  return (
    <label className={cn("flex items-start gap-3 rounded-lg p-2", className)}>
      <input
        ref={ref}
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-border text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        {...props}
      />
      <span className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </span>
    </label>
  );
});
