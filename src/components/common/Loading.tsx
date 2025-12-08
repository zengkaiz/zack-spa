import type React from 'react';

interface LoadingProps {
	size?: 'small' | 'medium' | 'large';
	text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
	size = 'medium',
	text = 'Loading...',
}) => {
	const sizeClasses = {
		small: 'h-5 w-5 border-2',
		medium: 'h-10 w-10 border-4',
		large: 'h-16 w-16 border-4',
	};

	return (
		<div className='flex flex-col items-center justify-center p-5'>
			<div
				className={`${sizeClasses[size]} animate-spin rounded-full border-gray-200 border-t-blue-500`}
			/>
			{text && <p className='mt-4 text-sm text-gray-600'>{text}</p>}
		</div>
	);
};

export default Loading;
