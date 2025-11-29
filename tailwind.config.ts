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
    darkMode: ["class"],
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
  		colors: {
  			brand: {
  				DEFAULT: '#3b82f6',
  				light: '#60a5fa',
  				dark: '#2563eb'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-geist-sans)',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-geist-mono)',
  				'monospace'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },

  /*
   * Plugins
   * Add Tailwind plugins here. Common ones include:
   * - @tailwindcss/typography (for prose styling)
   * - @tailwindcss/forms (for better form defaults)
   * - tailwindcss-animate (for animations, added with shadcn/ui)
   */
  plugins: [require("tailwindcss-animate")],
};

export default config;
