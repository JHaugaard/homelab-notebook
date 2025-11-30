import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: {
					DEFAULT: 'var(--color-background)',
					secondary: 'var(--color-background-secondary)'
				},
				surface: {
					DEFAULT: 'var(--color-surface)',
					hover: 'var(--color-surface-hover)',
					active: 'var(--color-surface-active)'
				},
				border: {
					DEFAULT: 'var(--color-border)',
					strong: 'var(--color-border-strong)'
				},
				text: {
					DEFAULT: 'var(--color-text)',
					secondary: 'var(--color-text-secondary)',
					muted: 'var(--color-text-muted)',
					light: 'var(--color-text-light)'
				},
				primary: {
					DEFAULT: 'var(--color-primary)',
					hover: 'var(--color-primary-hover)',
					subtle: 'var(--color-primary-subtle)'
				},
				// Notion semantic colors
				notion: {
					blue: 'var(--color-blue)',
					green: 'var(--color-green)',
					yellow: 'var(--color-yellow)',
					orange: 'var(--color-orange)',
					pink: 'var(--color-pink)',
					purple: 'var(--color-purple)'
				}
			},
			fontFamily: {
				serif: ['var(--font-serif)'],
				sans: ['var(--font-sans)'],
				mono: ['var(--font-mono)']
			},
			boxShadow: {
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)'
			},
			borderRadius: {
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)'
			}
		}
	},
	plugins: []
} satisfies Config;
