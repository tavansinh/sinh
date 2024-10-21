import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{ts,tsx}', './index.html'],
	theme: {
		extend: {
			fontFamily: {
				body: ['Roboto', 'sans-serif'],
			},
		},
	},
	important: true,
	plugins: [],
};

export default config;
