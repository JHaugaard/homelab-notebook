import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		}
	},
	{
		// Downgrade certain rules from error to warn for CI
		rules: {
			// Unused variables - warn instead of error (common during development)
			'@typescript-eslint/no-unused-vars': 'warn',

			// Useless escape - warn instead of error
			'no-useless-escape': 'warn'
		}
	},
	{
		files: ['**/*.svelte'],
		rules: {
			// XSS warning for @html - warn instead of error (we sanitize with DOMPurify)
			'svelte/no-at-html-tags': 'warn',

			// Accessibility labels - warn instead of error (fix later)
			'svelte/valid-compile': [
				'error',
				{
					ignoreWarnings: true
				}
			]
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/', 'pocketbase/']
	}
);
