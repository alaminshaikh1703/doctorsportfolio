/**
 * Centralized Design System Tokens
 * Strictly used across React components to prevent hardcoded values.
 */

export const ANIMATION_TOKENS = {
  duration: {
    fast: 0.25,   // 0.25s
    medium: 0.45, // 0.45s
    slow: 0.7,    // 0.70s
  },
  ease: {
    cubic: [0.16, 1, 0.3, 1] as const,
    spring: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
    gentleSpring: {
      type: "spring",
      stiffness: 120,
      damping: 14,
    },
  },
} as const;

export const BREAKPOINTS = {
  xs: "375px",   // Mobile-first baseline
  sm: "640px",   // Small tablets
  md: "768px",   // Tablets
  lg: "1024px",  // Small laptops
  xl: "1280px",  // Desktop
  "2xl": "1536px"// Wide screens
} as const;

export const COLOR_TOKENS = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  accent: "#3B82F6",
  dark: "#0F172A",
  darkSurface: "#1E293B",
  background: "#e3aff0",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#334155",
  textMuted: "#64748B",
  success: "#10B981",
  warning: "#F59E0B",
} as const;

export const SHADOW_TOKENS = {
  sm: "0 1px 3px rgba(15, 23, 42, 0.04)",
  md: "0 4px 12px rgba(37, 99, 235, 0.05)",
  lg: "0 12px 28px -4px rgba(37, 99, 235, 0.08)",
  hover: "0 20px 40px -8px rgba(37, 99, 235, 0.12)",
  glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
} as const;

export const RADIUS_TOKENS = {
  sm: "10px",
  md: "14px",
  card: "20px",
  xl: "24px",
  full: "9999px",
} as const;
