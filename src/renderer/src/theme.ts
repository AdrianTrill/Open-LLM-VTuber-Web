import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const ceceConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e8f5e9" },
          100: { value: "#c8e6c9" },
          200: { value: "#a5d6a7" },
          300: { value: "#81c784" },
          400: { value: "#76B900" },
          500: { value: "#6aaa00" },
          600: { value: "#558b00" },
          700: { value: "#406d00" },
          800: { value: "#2b4e00" },
          900: { value: "#1a3000" },
        },
        surface: {
          bg: { value: "#0f1117" },
          panel: { value: "#161922" },
          card: { value: "#1c2030" },
          elevated: { value: "#242838" },
          border: { value: "rgba(255, 255, 255, 0.08)" },
          borderHover: { value: "rgba(255, 255, 255, 0.15)" },
        },
        text: {
          primary: { value: "#f0f0f5" },
          secondary: { value: "rgba(255, 255, 255, 0.65)" },
          muted: { value: "rgba(255, 255, 255, 0.4)" },
        },
      },
      fonts: {
        heading: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
        body: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
      },
    },
  },
});

export const ceceSystem = createSystem(defaultConfig, ceceConfig);
