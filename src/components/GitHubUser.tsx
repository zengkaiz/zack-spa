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
		<div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm'>
			<h2 className='mb-5 text-2xl font-semibold text-gray-800'>
				GitHub 用户信息查询
			</h2>

			<form onSubmit={handleSubmit} className='mb-6'>
				<div className='mb-4'>
					<label htmlFor='token' className='mb-2 block font-bold text-gray-700'>
						GitHub Token
					</label>
					<input
						id='token'
						type='text'
						placeholder='请输入 GitHub Personal Access Token'
						value={token}
						onChange={(e) => setToken(e.target.value)}
						required
						disabled={loading}
						className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
					/>
					<p className='mt-1 text-xs text-gray-500'>
						需要有 <code className='rounded bg-gray-100 px-1'>user:read</code>{' '}
						权限
					</p>
				</div>

				<button
					type='submit'
					disabled={loading}
					className='w-full rounded-md bg-blue-600 px-4 py-3 text-base text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400'
				>
					{loading ? '查询中...' : '查询用户信息'}
				</button>
			</form>

			{message && (
				<div
					className={`mb-4 rounded-md border px-4 py-3 text-center ${
						messageType === 'success'
							? 'border-green-300 bg-green-100 text-green-800'
							: 'border-red-300 bg-red-100 text-red-800'
					}`}
				>
					{message}
				</div>
			)}

			{userData && (
				<div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
					<div className='mb-4 flex items-start gap-4'>
						<img
							src={userData.avatar_url}
							alt={userData.login}
							className='h-24 w-24 rounded-full border-2 border-gray-300'
						/>
						<div className='flex-1'>
							<h3 className='text-xl font-bold text-gray-800'>
								{userData.name || userData.login}
							</h3>
							<p className='text-sm text-gray-500'>@{userData.login}</p>
							<a
								href={userData.html_url}
								target='_blank'
								rel='noopener noreferrer'
								className='mt-2 inline-block text-sm text-blue-600 hover:text-blue-700'
							>
								查看 GitHub 主页 →
							</a>
						</div>
					</div>

					{userData.bio && (
						<div className='mb-4'>
							<p className='text-sm text-gray-700'>{userData.bio}</p>
						</div>
					)}

					<div className='grid grid-cols-3 gap-4 rounded-md bg-white p-4'>
						<div className='text-center'>
							<div className='text-2xl font-bold text-gray-800'>
								{userData.public_repos}
							</div>
							<div className='text-xs text-gray-500'>仓库</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-gray-800'>
								{userData.followers}
							</div>
							<div className='text-xs text-gray-500'>关注者</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold text-gray-800'>
								{userData.following}
							</div>
							<div className='text-xs text-gray-500'>正在关注</div>
						</div>
					</div>

					<div className='mt-4 text-xs text-gray-500'>
						注册时间:{' '}
						{new Date(userData.created_at).toLocaleDateString('zh-CN')}
					</div>
				</div>
			)}
		</div>
	);
};

export default GitHubUser;
