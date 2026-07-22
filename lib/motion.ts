import type { Transition, Variants } from "framer-motion";

/** Shared easing/duration so every transition in the app feels consistent. */
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

export const transitionPremium: Transition = {
  duration: 0.45,
  ease: EASE_PREMIUM,
};

export const transitionSnappy: Transition = {
  duration: 0.2,
  ease: EASE_PREMIUM,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: transitionPremium },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionPremium },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -3,
    scale: 1.01,
    transition: transitionSnappy,
  },
};
