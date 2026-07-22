"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { formatCurrency } from "@/lib/format";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

/**
 * Purely presentational: animates the transition between already-computed
 * values with a spring, it never recomputes or alters `value` itself.
 */
export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 220, damping: 28, mass: 0.6 });
  const display = useTransform(spring, (latest) => formatCurrency(latest));

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span className={className}>{display}</motion.span>;
}
