import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "default" | "danger";
}

export function IconButton({ label, variant = "default", className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
        variant === "danger" && "hover:border-red-200 hover:bg-red-50 hover:text-red-600",
        className
      )}
      {...props}
    />
  );
}
