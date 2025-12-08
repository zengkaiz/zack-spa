import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface PageNotFoundViewProps {
	title?: string;
	message?: string;
	showBackButton?: boolean;
}

export const PageNotFoundView: React.FC<PageNotFoundViewProps> = ({
	title = '404',
	message = 'Page Not Found',
	showBackButton = true,
}) => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleGoHome = () => {
		navigate('/');
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
				padding: '20px',
				textAlign: 'center',
				backgroundColor: '#f5f5f5',
			}}
		>
			<h1
				style={{
					fontSize: '96px',
					fontWeight: 'bold',
					margin: '0',
					color: '#333',
				}}
			>
				{title}
			</h1>
			<p
				style={{
					fontSize: '24px',
					color: '#666',
					margin: '20px 0 40px',
				}}
			>
				{message}
			</p>
			<div style={{ display: 'flex', gap: '16px' }}>
				{showBackButton && (
					<button
						type='button'
						onClick={handleGoBack}
						style={{
							padding: '12px 24px',
							fontSize: '16px',
							color: '#fff',
							backgroundColor: '#6c757d',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							transition: 'background-color 0.3s',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = '#5a6268';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = '#6c757d';
						}}
					>
						Go Back
					</button>
				)}
				<button
					type='button'
					onClick={handleGoHome}
					style={{
						padding: '12px 24px',
						fontSize: '16px',
						color: '#fff',
						backgroundColor: '#3498db',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						transition: 'background-color 0.3s',
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = '#2980b9';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = '#3498db';
					}}
				>
					Go Home
				</button>
			</div>
		</div>
	);
};

export default PageNotFoundView;
