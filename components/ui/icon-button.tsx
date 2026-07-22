"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";
import { transitionSnappy } from "@/lib/motion";

interface IconButtonProps extends HTMLMotionProps<"button"> {
  label: string;
  variant?: "default" | "danger";
}

export function IconButton({ label, variant = "default", className, ...props }: IconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.93 }}
      transition={transitionSnappy}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground backdrop-blur-xl transition-colors duration-200 hover:border-border-strong hover:bg-card-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-40",
        variant === "danger" && "hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400",
        className
      )}
      {...props}
    />
  );
}
