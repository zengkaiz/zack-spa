import type React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	return (
		<header className='bg-white px-5 shadow-md'>
			<nav className='mx-auto flex h-16 max-w-7xl items-center justify-between'>
				<div className='text-2xl font-bold text-blue-500'>My App</div>
				<div className='flex gap-3'>
					<Link
						to='/'
						className={`border-b-2 px-5 py-2 no-underline transition-all ${
							isActive('/')
								? 'border-blue-500 font-bold text-blue-500'
								: 'border-transparent text-gray-800 hover:text-blue-500'
						}`}
					>
						Home
					</Link>
					<Link
						to='/about'
						className={`border-b-2 px-5 py-2 no-underline transition-all ${
							isActive('/about')
								? 'border-blue-500 font-bold text-blue-500'
								: 'border-transparent text-gray-800 hover:text-blue-500'
						}`}
					>
						About
					</Link>
				</div>
			</nav>
		</header>
	);
};

export default Header;
