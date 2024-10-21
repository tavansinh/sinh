import '@/assets/style/App.css';
import AppRouter from '@/routes/AppRouter';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<HelmetProvider>
			<AppRouter />
		</HelmetProvider>
	</StrictMode>,
);
