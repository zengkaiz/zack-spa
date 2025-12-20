import { GitHubUser } from '@components/GitHubUser';
import type React from 'react';
import { type FormEvent, useEffect, useState } from 'react';

interface ContactFormData {
	name: string;
	email: string;
}

interface Contact {
	id: number;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

interface ApiResponse {
	success: boolean;
	message?: string;
	data?: Contact;
}

interface ContactListResponse {
	success: boolean;
	data: Contact[];
	total: number;
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
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loadingContacts, setLoadingContacts] = useState(true);

	const fetchContacts = async () => {
		try {
			const response = await fetch(`/api/contacts`);
			const result: ContactListResponse = await response.json();

			if (result.success) {
				setContacts(result.data);
			}
		} catch (error) {
			console.error('Failed to fetch contacts:', error);
		} finally {
			setLoadingContacts(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount
	useEffect(() => {
		fetchContacts();
	}, []);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		try {
			const response = await fetch(`/api/contacts`, {
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
				fetchContacts();
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

			<section className='mt-10'>
				<h2 className='mb-5 text-3xl font-semibold text-gray-800'>
					联系人列表
					{contacts.length > 0 && (
						<span className='ml-2 text-lg text-gray-500'>
							(总计: {contacts.length})
						</span>
					)}
				</h2>

				{loadingContacts ? (
					<div className='py-8 text-center text-gray-500'>加载中...</div>
				) : contacts.length === 0 ? (
					<div className='rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500'>
						暂无联系人记录
					</div>
				) : (
					<div className='overflow-hidden rounded-lg border border-gray-200'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
										ID
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
										姓名
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
										邮箱
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
										创建时间
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200 bg-white'>
								{contacts.map((contact) => (
									<tr key={contact.id} className='hover:bg-gray-50'>
										<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
											{contact.id}
										</td>
										<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
											{contact.name}
										</td>
										<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
											{contact.email}
										</td>
										<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
											{new Date(contact.createdAt).toLocaleString('zh-CN')}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>

			<section className='mt-10'>
				<GitHubUser />
			</section>
		</div>
	);
};

export default About;
