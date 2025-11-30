import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--color-background)',
				surface: 'var(--color-surface)',
				'surface-hover': 'var(--color-surface-hover)',
				border: 'var(--color-border)',
				'text-primary': 'var(--color-text)',
				'text-muted': 'var(--color-text-muted)',
				primary: {
					DEFAULT: 'var(--color-primary)',
					hover: 'var(--color-primary-hover)'
				}
			},
			fontFamily: {
				mono: ['JetBrains Mono', 'Fira Code', 'monospace']
			}
		}
	},
	plugins: []
} satisfies Config;
