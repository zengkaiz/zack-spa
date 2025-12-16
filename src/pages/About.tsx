import type React from 'react';
import { type FormEvent, useState } from 'react';

interface ContactFormData {
	name: string;
	email: string;
}

interface ApiResponse {
	success: boolean;
	message?: string;
	data?: any;
}

export const About: React.FC = () => {
	const [formData, setFormData] = useState<ContactFormData>({
		name: '',
		email: '',
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState<'success' | 'error'>(
		'success'
	);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		try {
			const API_URL = process.env.REACT_APP_API_URL;
			const response = await fetch(`${API_URL}/api/contacts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const result: ApiResponse = await response.json();

			if (result.success) {
				setMessageType('success');
				setMessage(result.message || '提交成功！');
				setFormData({ name: '', email: '' });
			} else {
				setMessageType('error');
				setMessage(result.message || '提交失败');
			}
		} catch (_error) {
			setMessageType('error');
			setMessage('网络错误，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

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

			<section className='rounded-lg border border-gray-200 bg-gray-50 p-8'>
				<h2 className='mb-5 text-3xl font-semibold text-gray-800'>联系我们</h2>
				<p className='mb-5 text-lg leading-loose text-gray-600'>
					Have questions or want to collaborate? Feel free to reach out!
				</p>

				<form onSubmit={handleSubmit} className='max-w-md'>
					<div className='mb-4'>
						<label
							htmlFor='name'
							className='mb-2 block font-bold text-gray-700'
						>
							姓名
						</label>
						<input
							id='name'
							type='text'
							placeholder='请输入姓名'
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							required
							disabled={loading}
							className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
						/>
					</div>

					<div className='mb-4'>
						<label
							htmlFor='email'
							className='mb-2 block font-bold text-gray-700'
						>
							邮箱
						</label>
						<input
							id='email'
							type='email'
							placeholder='请输入邮箱'
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							required
							disabled={loading}
							className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full rounded-md bg-green-600 px-4 py-3 text-base text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400'
					>
						{loading ? '提交中...' : '提交'}
					</button>
				</form>

				{message && (
					<div
						className={`mt-4 rounded-md border px-4 py-3 text-center ${
							messageType === 'success'
								? 'border-green-300 bg-green-100 text-green-800'
								: 'border-red-300 bg-red-100 text-red-800'
						}`}
					>
						{message}
					</div>
				)}
			</section>
		</div>
	);
};

export default About;
