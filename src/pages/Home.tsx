import type React from 'react';
import { WalletDemo } from '@/components';
import DApp from '@/components/dapp';
import Demo from '@/components/demo';

export const Home: React.FC = () => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
			<div className='mx-auto max-w-7xl px-6 py-12'>
				{/* 钱包登录示例模块 */}
				<section className='mb-16'>
					<div className='mb-8'>
						<h2 className='mb-3 text-4xl font-bold text-gray-900'>
							💼 钱包连接
						</h2>
						<p className='text-lg text-gray-600'>
							使用 MetaMask 连接你的 Web3 钱包
						</p>
					</div>
					<div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-shadow hover:shadow-2xl'>
						<WalletDemo />
					</div>
				</section>

				{/* Web3 Integration 模块 */}
				<section className='mb-16'>
					<div className='mb-8'>
						<h2 className='mb-3 text-4xl font-bold text-gray-900'>
							🔗 Web3 Integration
						</h2>
						<p className='text-lg text-gray-600'>
							与智能合约交互，体验去中心化应用
						</p>
					</div>
					<div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-shadow hover:shadow-2xl'>
						<DApp />
					</div>
				</section>

				{/* 状态撕裂模块 */}
				<section className='mb-16'>
					<div className='mb-8'>
						<h2 className='mb-3 text-4xl font-bold text-gray-900'>
							⚡ 状态管理
						</h2>
						<p className='text-lg text-gray-600'>
							使用 Jotai + Immer 优化组件渲染性能
						</p>
					</div>
					<div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-shadow hover:shadow-2xl'>
						<Demo />
					</div>
				</section>

				{/* 页脚提示 */}
				<footer className='mt-20 text-center'>
					<div className='inline-block rounded-full bg-white px-8 py-4 shadow-lg'>
						<p className='text-sm text-gray-600'>
							Built with ❤️ using React, TypeScript & TailwindCSS
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default Home;
