import MainLayout from '@layouts/Layout';
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Loading, PageNotFoundView } from '@/components/common';

const Home = lazy(() => import('@pages/Home'));
const About = lazy(() => import('@pages/About'));

const routes: RouteObject[] = [
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: (
					<Suspense fallback={<Loading />}>
						<Home />
					</Suspense>
				),
			},
			{
				path: 'about',
				element: (
					<Suspense fallback={<Loading />}>
						<About />
					</Suspense>
				),
			},
		],
	},
	{
		path: '*',
		element: <PageNotFoundView />,
	},
];

export default routes;
