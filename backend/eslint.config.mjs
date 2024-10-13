import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{ languageOptions: { globals: globals.es2025 } },
	...tseslint.configs.recommended,
	eslintPluginPrettierRecommended,

	{
		rules: {
			'prettier/prettier': 'warn',
			'react/react-in-jsx-scope': 'off',
			camelcase: 'error',
			'spaced-comment': 'off',
			quotes: ['error', 'single'],
			'no-duplicate-imports': 'error',
			'no-debugger': 'warn',
			'react/prop-types': 'off',
			'object-curly-spacing': ['warn', 'always'],
			semi: ['warn', 'always'],
			indent: ['warn', 'tab'],
			'no-unused-expressions': 'warn',
			'no-mixed-spaces-and-tabs': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn'
		},
		settings: {
			'import/resolver': {
				typescript: {}
			}
		}
	}
];
