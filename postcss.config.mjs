/*
 * PostCSS Configuration
 *
 * PostCSS is a tool for transforming CSS with JavaScript plugins.
 * It runs during the build process and transforms your CSS before
 * it's sent to the browser.
 *
 * This minimal config includes:
 * - tailwindcss: Generates utility classes from your Tailwind config
 * - autoprefixer: Adds vendor prefixes (-webkit-, -moz-, etc.) for
 *   cross-browser compatibility
 *
 * The order matters: Tailwind runs first to generate the CSS,
 * then autoprefixer adds any necessary vendor prefixes.
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
