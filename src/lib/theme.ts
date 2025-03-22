// Nebula Theme Colors
export const themeColors = {
  // Primary colors
  primary: {
    DEFAULT: "#7C3AED", // Purple
    50: "#F5F3FF",
    100: "#EDE9FE",
    200: "#DDD6FE",
    300: "#C4B5FD",
    400: "#A78BFA",
    500: "#8B5CF6",
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
  },

  // Secondary colors (blue/teal for accents)
  secondary: {
    DEFAULT: "#06B6D4", // Cyan
    50: "#ECFEFF",
    100: "#CFFAFE",
    200: "#A5F3FC",
    300: "#67E8F9",
    400: "#22D3EE",
    500: "#06B6D4",
    600: "#0891B2",
    700: "#0E7490",
    800: "#155E75",
    900: "#164E63",
  },

  // Background colors (dark mode)
  background: {
    DEFAULT: "#0F172A", // Dark blue
    lighter: "#1E293B",
    card: "rgba(30, 41, 59, 0.8)", // For glassmorphism
    overlay: "rgba(15, 23, 42, 0.75)",
  },

  // Text colors
  text: {
    DEFAULT: "#F8FAFC", // Light gray
    muted: "#94A3B8",
    accent: "#A78BFA", // Purple accent
  },

  // Star/cosmos accent colors (for decorative elements)
  stars: {
    bright: "#FFFFFF",
    purple: "#C4B5FD",
    blue: "#93C5FD",
    teal: "#5EEAD4",
    pink: "#F9A8D4",
  },
};

// Nebula-themed shadows for glassmorphism
export const themeShadows = {
  sm: "0 1px 2px rgba(30, 41, 59, 0.05), 0 0 4px rgba(124, 58, 237, 0.05)",
  DEFAULT: "0 4px 6px rgba(30, 41, 59, 0.05), 0 0 8px rgba(124, 58, 237, 0.1)",
  md: "0 10px 15px rgba(30, 41, 59, 0.1), 0 0 10px rgba(124, 58, 237, 0.2)",
  lg: "0 20px 25px rgba(30, 41, 59, 0.15), 0 0 15px rgba(124, 58, 237, 0.2)",
  xl: "0 25px 50px rgba(30, 41, 59, 0.25), 0 0 20px rgba(124, 58, 237, 0.25)",
  glow: "0 0 15px rgba(124, 58, 237, 0.5), 0 0 30px rgba(124, 58, 237, 0.3)",
};

// Animation timings
export const animations = {
  fast: "150ms",
  DEFAULT: "300ms",
  slow: "500ms",
  verySlow: "1000ms",
};
