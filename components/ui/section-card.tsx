"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeInUp } from "@/lib/motion";

interface SectionCardProps {
  title: string;
  description?: string;
  /** Optional step number (1-based) rendered as an elegant badge before the title. */
  step?: number;
  children: ReactNode;
}

export function SectionCard({ title, description, step, children }: SectionCardProps) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-colors duration-300 sm:p-7"
    >
      <div className="mb-6 flex items-start gap-3">
        {step !== undefined && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-xs font-semibold tabular-nums text-accent-soft">
            {String(step).padStart(2, "0")}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </motion.section>
  );
}
