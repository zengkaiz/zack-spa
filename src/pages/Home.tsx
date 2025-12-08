import type React from 'react';
import DApp from '@/components/dapp';
import Demo from '@/components/demo';

export const Home: React.FC = () => {
	return (
		<div className='mx-auto max-w-7xl px-5 py-10'>
			<section className='mb-10'>
				<h1 className='mb-5 text-5xl font-bold text-gray-800'>
					Welcome to My App
				</h1>
				<p className='text-lg leading-relaxed text-gray-600'>
					This is a modern single-page application built with React, TypeScript,
					and Webpack.
				</p>
			</section>

			<section className='mt-10'>
				<h2 className='mb-5 text-4xl font-bold text-gray-800'>
					🔗 Web3 Integration
				</h2>
				<div className='rounded-lg border border-gray-200 bg-white p-5 shadow-sm'>
					<DApp />
				</div>
			</section>
			<section className='mt-10'>
				<h2 className='mb-5 text-4xl font-bold text-gray-800'>状态撕裂</h2>
				<div className='rounded-lg border border-gray-200 bg-white p-5 shadow-sm'>
					<Demo />
				</div>
			</section>
		</div>
	);
};

export default Home;
