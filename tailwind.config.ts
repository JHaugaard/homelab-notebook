import type { Config } from "tailwindcss";

/*
 * Tailwind CSS Configuration
 *
 * This configuration sets up Tailwind for a Next.js App Router project.
 * The `content` array tells Tailwind which files to scan for class names,
 * which enables "tree-shaking" - only CSS classes you actually use end up
 * in the final bundle.
 *
 * When we add shadcn/ui later, this file will be extended with:
 * - Custom color variables (CSS custom properties)
 * - Border radius tokens
 * - Animation utilities
 */
const config: Config = {
  /*
   * Content Paths
   * Tailwind scans these files to find class names.
   * Only classes found in these files are included in the final CSS.
   */
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      /*
       * Custom Colors
       * Define your brand colors here. These can be used like:
       * bg-brand, text-brand-dark, border-brand-light
       */
      colors: {
        brand: {
          DEFAULT: "#3b82f6", // blue-500
          light: "#60a5fa", // blue-400
          dark: "#2563eb", // blue-600
        },
      },

      /*
       * Font Family
       * Using system fonts for better performance.
       * The variable fonts from next/font will be added here in layout.tsx
       */
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },

  /*
   * Plugins
   * Add Tailwind plugins here. Common ones include:
   * - @tailwindcss/typography (for prose styling)
   * - @tailwindcss/forms (for better form defaults)
   * - tailwindcss-animate (for animations, added with shadcn/ui)
   */
  plugins: [],
};

export default config;
