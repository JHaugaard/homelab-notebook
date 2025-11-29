/*
 * ESLint Configuration (Flat Config Format)
 *
 * ESLint 9+ uses a new "flat config" format (eslint.config.mjs) instead of
 * the older .eslintrc.json format. This new format is more explicit and
 * gives you better control over what rules apply to which files.
 *
 * This config extends Next.js's recommended ESLint rules, which include:
 * - React best practices
 * - Next.js-specific rules (like proper next/image usage)
 * - Accessibility rules (jsx-a11y)
 * - Import order rules
 */
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Get directory path for ESM modules (can't use __dirname in ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat allows using older eslintrc-style configs in the new flat format
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  /*
   * Extend Next.js ESLint configs
   * - core-web-vitals: Strict rules for Next.js best practices
   * - typescript: TypeScript-specific rules
   */
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  /*
   * Custom rule overrides
   * Add project-specific rule modifications here
   */
  {
    rules: {
      // Allow unused variables that start with underscore
      // Useful for intentionally ignored function parameters
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
