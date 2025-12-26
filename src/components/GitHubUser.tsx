import { Button, Input, Label } from '@zack/ui';
import { type FormEvent, useState } from 'react';

interface GitHubUserData {
	login: string;
	name: string;
	avatar_url: string;
	bio: string;
	public_repos: number;
	followers: number;
	following: number;
	html_url: string;
	created_at: string;
}

interface ApiResponse {
	success: boolean;
	message?: string;
	data?: GitHubUserData;
}

export const GitHubUser = () => {
	const [token, setToken] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState<'success' | 'error'>(
		'success'
	);
	const [userData, setUserData] = useState<GitHubUserData | null>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');
		setUserData(null);

		try {
			const response = await fetch(`/api/github/user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			});

			const result: ApiResponse = await response.json();

			if (result.success && result.data) {
				setMessageType('success');
				setMessage('获取用户信息成功！');
				setUserData(result.data);
			} else {
				setMessageType('error');
				setMessage(result.message || '获取用户信息失败');
			}
		} catch (_error) {
			setMessageType('error');
			setMessage('网络错误，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='group transform rounded-2xl border-2 border-indigo-100 bg-white p-10 shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-indigo-300 hover:shadow-indigo-200'>
			<div className='mb-8'>
				<div className='mb-4 inline-block rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3'>
					<svg
						className='h-6 w-6 text-white'
						fill='currentColor'
						viewBox='0 0 24 24'
						aria-label='GitHub icon'
					>
						<title>GitHub</title>
						<path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
					</svg>
				</div>
				<h2 className='mb-3 text-4xl font-extrabold text-gray-900'>
					GitHub 用户信息查询
				</h2>
				<p className='text-lg text-gray-600'>
					输入你的 GitHub Personal Access Token 查询用户信息
				</p>
			</div>

			<form onSubmit={handleSubmit} className='mb-6 space-y-6'>
				<div className='space-y-2'>
					<Label htmlFor='token' className='text-base font-semibold'>
						GitHub Token
					</Label>
					<Input
						id='token'
						type='text'
						placeholder='请输入 GitHub Personal Access Token'
						value={token}
						onChange={(e) => setToken(e.target.value)}
						required
						disabled={loading}
						size='lg'
						className='transition-all duration-200 focus:ring-2 focus:ring-indigo-500'
					/>
					<p className='text-xs text-gray-500'>
						需要有{' '}
						<code className='rounded bg-indigo-100 px-2 py-1 font-mono text-indigo-700'>
							user:read
						</code>{' '}
						权限
					</p>
				</div>

				<Button
					type='submit'
					disabled={loading}
					className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700'
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
							查询中...
						</span>
					) : (
						'查询用户信息'
					)}
				</Button>
			</form>

			{message && (
				<div
					className={`mb-6 animate-fade-in rounded-xl border-2 px-5 py-4 text-center font-semibold shadow-lg ${
						messageType === 'success'
							? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800'
							: 'border-red-300 bg-gradient-to-r from-red-50 to-rose-50 text-red-800'
					}`}
				>
					{message}
				</div>
			)}

			{userData && (
				<div className='animate-fade-in rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-8 shadow-xl'>
					<div className='mb-8 flex items-start gap-6'>
						<div className='relative'>
							<img
								src={userData.avatar_url}
								alt={userData.login}
								className='h-32 w-32 rounded-2xl border-4 border-white shadow-2xl ring-4 ring-indigo-200'
							/>
							<div className='absolute -bottom-2 -right-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-2 shadow-lg'>
								<svg
									className='h-5 w-5 text-white'
									fill='currentColor'
									viewBox='0 0 24 24'
									aria-label='GitHub badge'
								>
									<title>GitHub badge</title>
									<path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
								</svg>
							</div>
						</div>
						<div className='flex-1'>
							<h3 className='text-3xl font-black text-gray-900'>
								{userData.name || userData.login}
							</h3>
							<p className='mt-2 text-lg font-medium text-indigo-600'>
								@{userData.login}
							</p>
							<a
								href={userData.html_url}
								target='_blank'
								rel='noopener noreferrer'
								className='mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700'
							>
								查看 GitHub 主页
								<svg
									className='h-4 w-4'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									aria-label='Arrow right'
								>
									<title>Arrow right</title>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M14 5l7 7m0 0l-7 7m7-7H3'
									/>
								</svg>
							</a>
						</div>
					</div>

					{userData.bio && (
						<div className='mb-8 rounded-xl bg-white/70 p-5 backdrop-blur-sm'>
							<p className='text-base leading-relaxed text-gray-700'>
								{userData.bio}
							</p>
						</div>
					)}

					<div className='grid grid-cols-3 gap-5'>
						<div className='transform rounded-xl bg-white p-6 text-center shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl'>
							<div className='text-4xl font-black text-indigo-600'>
								{userData.public_repos}
							</div>
							<div className='mt-2 text-sm font-semibold uppercase tracking-wide text-gray-600'>
								仓库
							</div>
						</div>
						<div className='transform rounded-xl bg-white p-6 text-center shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl'>
							<div className='text-4xl font-black text-purple-600'>
								{userData.followers}
							</div>
							<div className='mt-2 text-sm font-semibold uppercase tracking-wide text-gray-600'>
								关注者
							</div>
						</div>
						<div className='transform rounded-xl bg-white p-6 text-center shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl'>
							<div className='text-4xl font-black text-pink-600'>
								{userData.following}
							</div>
							<div className='mt-2 text-sm font-semibold uppercase tracking-wide text-gray-600'>
								正在关注
							</div>
						</div>
					</div>

					<div className='mt-8 text-center'>
						<span className='inline-block rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 text-sm font-bold text-white shadow-lg'>
							注册时间:{' '}
							{new Date(userData.created_at).toLocaleDateString('zh-CN', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default GitHubUser;
