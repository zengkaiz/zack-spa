import { GitHubUser } from '@components/GitHubUser';
import { Button, Input, Label } from '@zack/ui';
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
		<div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'>
			<div className='mx-auto max-w-7xl px-6 py-16'>
				<div className='grid gap-10 lg:grid-cols-2'>
					{/* 联系我们表单 */}
					<section className='group transform rounded-2xl border-2 border-purple-100 bg-white p-10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-purple-300 hover:shadow-purple-200'>
						<div className='mb-8'>
							<div className='mb-4 inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-3'>
								<svg
									className='h-6 w-6 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									aria-label='Contact icon'
								>
									<title>Contact</title>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
									/>
								</svg>
							</div>
							<h2 className='mb-3 text-4xl font-extrabold text-gray-900'>
								联系我们
							</h2>
							<p className='text-lg text-gray-600'>
								Have questions or want to collaborate? Feel free to reach out!
							</p>
						</div>

						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='space-y-2'>
								<Label htmlFor='name' className='text-base font-semibold'>
									姓名
								</Label>
								<Input
									id='name'
									type='text'
									placeholder='请输入姓名'
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
									disabled={loading}
									size='lg'
									className='transition-all duration-200 focus:ring-2 focus:ring-purple-500'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='email' className='text-base font-semibold'>
									邮箱
								</Label>
								<Input
									id='email'
									type='email'
									placeholder='请输入邮箱'
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									required
									disabled={loading}
									size='lg'
									className='transition-all duration-200 focus:ring-2 focus:ring-purple-500'
								/>
							</div>

							<Button
								type='submit'
								variant='default'
								disabled={loading}
								className='w-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-200 hover:from-purple-700 hover:to-blue-700'
								size='lg'
							>
								{loading ? (
									<span className='flex items-center justify-center'>
										<svg
											className='mr-2 h-5 w-5 animate-spin'
											fill='none'
											viewBox='0 0 24 24'
											aria-label='Loading'
										>
											<title>Loading</title>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'
											/>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
											/>
										</svg>
										提交中...
									</span>
								) : (
									'提交'
								)}
							</Button>
						</form>

						{message && (
							<div
								className={`mt-6 animate-fade-in rounded-xl border-2 px-5 py-4 text-center font-semibold shadow-lg ${
									messageType === 'success'
										? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800'
										: 'border-red-300 bg-gradient-to-r from-red-50 to-rose-50 text-red-800'
								}`}
							>
								{message}
							</div>
						)}
					</section>

					{/* 联系人列表 */}
					<section className='group transform rounded-2xl border-2 border-blue-100 bg-white p-10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 hover:shadow-blue-200'>
						<div className='mb-8'>
							<div className='mb-4 inline-block rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-3'>
								<svg
									className='h-6 w-6 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									aria-label='Contacts list icon'
								>
									<title>Contacts</title>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
									/>
								</svg>
							</div>
							<h2 className='mb-2 text-4xl font-extrabold text-gray-900'>
								联系人列表
								{contacts.length > 0 && (
									<span className='ml-3 inline-block rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-1 text-lg font-bold text-white shadow-lg'>
										{contacts.length}
									</span>
								)}
							</h2>
						</div>

						{loadingContacts ? (
							<div className='flex flex-col items-center justify-center py-16'>
								<div className='mb-4 h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
								<p className='text-lg font-medium text-gray-600'>加载中...</p>
							</div>
						) : contacts.length === 0 ? (
							<div className='rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 p-16 text-center'>
								<svg
									className='mx-auto mb-4 h-16 w-16 text-gray-400'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									aria-label='Empty inbox'
								>
									<title>Empty inbox</title>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
									/>
								</svg>
								<p className='text-xl font-semibold text-gray-500'>
									暂无联系人记录
								</p>
							</div>
						) : (
							<div className='max-h-[550px] overflow-auto rounded-xl border-2 border-gray-200 shadow-inner'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-500'>
										<tr>
											<th className='px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-white'>
												ID
											</th>
											<th className='px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-white'>
												姓名
											</th>
											<th className='px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-white'>
												邮箱
											</th>
											<th className='px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-white'>
												创建时间
											</th>
										</tr>
									</thead>
									<tbody className='divide-y divide-gray-200 bg-white'>
										{contacts.map((contact, index) => (
											<tr
												key={contact.id}
												className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
													index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
												}`}
											>
												<td className='whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900'>
													{contact.id}
												</td>
												<td className='whitespace-nowrap px-5 py-4 text-sm font-bold text-gray-900'>
													{contact.name}
												</td>
												<td className='whitespace-nowrap px-5 py-4 text-sm text-gray-600'>
													{contact.email}
												</td>
												<td className='whitespace-nowrap px-5 py-4 text-sm text-gray-500'>
													{new Date(contact.createdAt).toLocaleString('zh-CN')}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</section>
				</div>

				{/* GitHub用户信息查询 */}
				<section className='mt-16'>
					<GitHubUser />
				</section>

				{/* 页脚装饰 */}
				<footer className='mt-20 text-center'>
					<div className='inline-block transform rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 px-10 py-5 shadow-2xl transition-transform duration-300 hover:scale-105'>
						<p className='text-lg font-bold text-white'>
							💜 Built with passion & innovation
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default About;
