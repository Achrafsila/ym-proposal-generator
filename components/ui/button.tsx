"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";
import { transitionSnappy } from "@/lib/motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={transitionSnappy}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-[background-color,border-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-gradient-to-b from-accent-soft to-accent text-accent-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_30px_-10px_rgba(212,175,106,0.55)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_14px_36px_-8px_rgba(212,175,106,0.75)]",
        variant === "outline" &&
          "border border-border bg-card text-foreground backdrop-blur-xl hover:border-border-strong hover:bg-card-hover",
        className
      )}
      {...props}
    />
  );
});
