import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import './style.css';
import './wdyr.tsx';

const router = createBrowserRouter(routes);

const container = document.getElementById('app');
if (!container) {
	throw new Error('Failed to find the root container');
}

const root = createRoot(container);

root.render(<RouterProvider router={router} />);
