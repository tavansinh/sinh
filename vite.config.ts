import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		emptyOutDir: true,
	},
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	server: {
		proxy: {
			'/api': 'http://localhost:3000',
		},
	},
});
