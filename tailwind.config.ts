import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{ts,tsx}', './index.html'],
	theme: {
		extend: {
			fontFamily: {
				body: ['Roboto', 'sans-serif'],
			},
			keyframes: {
				'bounce-horizontal': {
					'0%, 100%': {
						transform: 'translateX(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
					},
					'50%': {
						transform: 'translateX(25%)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
					},
				},
			},
			animation: {
				'bounce-horizontal': 'bounce-horizontal 1s infinite',
			},
		},
	},
	important: true,
	plugins: [],
};

export default config;
