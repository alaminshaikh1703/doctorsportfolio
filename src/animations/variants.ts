import { Variants } from "framer-motion";
import { ANIMATION_TOKENS } from "../constants/tokens";

/**
 * Global Framer Motion Animation System
 * Strict 0.25s / 0.45s / 0.7s timing standard.
 */

// Stagger parent container
export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

// Fade up animation (Section reveals, text blocks)
export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: ANIMATION_TOKENS.duration.medium, // 0.45s
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Fade in (Subtle overlays, badges)
export const fadeInVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.fast, // 0.25s
      ease: "easeOut",
    },
  },
};

// Hero Portrait Slide & Scale Reveal (0.7s Slow duration)
export const heroPortraitVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.slow, // 0.7s
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Scale up (Cards, modal overlays)
export const scaleUpVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.medium, // 0.45s
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Slide In Left/Right
export const slideInLeftVariant: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_TOKENS.duration.medium,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const slideInRightVariant: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_TOKENS.duration.medium,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Continuous Floating Animation for Floating Cards
export const floatingCardVariant = (delaySeconds: number = 0): Variants => ({
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay: delaySeconds,
    },
  },
});

// Card Hover Micro-interaction (Spring)
export const cardHoverVariant: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: ANIMATION_TOKENS.duration.fast,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  hover: {
    scale: 1.02,
    y: -6,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

// Button Magnetic Ripple/Tap Effect
export const buttonTapVariant: Variants = {
  tap: { scale: 0.97 },
  hover: { scale: 1.03, transition: { duration: ANIMATION_TOKENS.duration.fast } },
};
