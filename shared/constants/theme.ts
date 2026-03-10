/**
 * App color system is currently light-only.
 * Matches the brand palette in tailwind.config.js (brand.*).
 */

import { Platform } from "react-native";

export const Colors = {
  // Semantic (used by ThemedText, ThemedView, tabs)
  text: "#000000",
  background: "#FFFFFF",
  icon: "#9B938F",
  tabIconDefault: "#9B938F",
  tabIconSelected: "#005451",
  // Brand palette (same as tailwind brand.*)
  primary: "#005451",
  primaryHover: "#00B9B3",
  primaryActive: "#81DACA",
  black: "#000000",
  grey: "#9B938F",
  greyHover: "#EDE7DF",
  greyLow: "#F7F5F3",
  white: "#FFFFFF",
  error: "#b91c1c",
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
