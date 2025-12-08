import type React from 'react';

export const About: React.FC = () => {
	return (
		<div className='mx-auto max-w-4xl px-5 py-10'>
			<h1 className='mb-8 text-5xl font-bold text-gray-800'>About Us</h1>

			<section className='mb-10'>
				<h2 className='mb-5 text-3xl font-semibold text-gray-800'>
					Our Mission
				</h2>
				<p className='mb-5 text-lg leading-loose text-gray-600'>
					We are dedicated to building modern, efficient, and user-friendly web
					applications that solve real-world problems.
				</p>
			</section>

			<section className='mb-10'>
				<h2 className='mb-5 text-3xl font-semibold text-gray-800'>
					Technology Stack
				</h2>
				<ul className='list-disc space-y-2 pl-5 text-lg leading-loose text-gray-600'>
					<li>React 19 - Modern UI library</li>
					<li>TypeScript - Type-safe development</li>
					<li>Webpack 5 - Module bundler</li>
					<li>SWC - Fast JavaScript/TypeScript compiler</li>
					<li>Biome - Code quality and formatting</li>
					<li>React Router - Client-side routing</li>
					<li>Tailwind CSS - Utility-first CSS framework</li>
				</ul>
			</section>

			<section className='rounded-lg border border-gray-200 bg-gray-50 p-8'>
				<h2 className='mb-5 text-3xl font-semibold text-gray-800'>Contact</h2>
				<p className='text-lg leading-loose text-gray-600'>
					Have questions or want to collaborate? Feel free to reach out!
				</p>
				<div className='mt-5'>
					<a
						href='mailto:contact@example.com'
						className='text-lg text-blue-500 no-underline hover:text-blue-600'
					>
						contact@example.com
					</a>
				</div>
			</section>
		</div>
	);
};

export default About;
