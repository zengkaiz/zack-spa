import { Button } from '@zack/ui';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { productAtomWithImmer } from '@/stores';

const Index = () => {
	const [data, setData] = useAtom(productAtomWithImmer);

	useEffect(() => {
		console.log('demo render');
		return () => {
			console.log('demo unmount');
		};
	}, []);

	return (
		<div className='space-y-6'>
			<div className='mb-6'>
				<h3 className='text-2xl font-bold text-gray-900'>状态撕裂示例</h3>
				<p className='mt-2 text-sm text-gray-600'>
					使用 Jotai + Immer 避免无意义的组件重渲染
				</p>
			</div>

			<div className='rounded-lg border border-gray-200 bg-white p-6'>
				<div className='mb-6 space-y-3'>
					<div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
						<span className='font-medium text-gray-700'>名称:</span>
						<span className='text-lg font-semibold text-gray-900'>
							{data.name}
						</span>
					</div>
					<div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
						<span className='font-medium text-gray-700'>标签:</span>
						<div className='flex flex-wrap gap-2'>
							{data.tags.map((tag) => (
								<span
									key={tag}
									className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'
								>
									{tag}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className='grid gap-4 md:grid-cols-2'>
					<Button
						onClick={() => {
							setData((prev) => ({
								...prev,
								name:
									prev.name === '无意义渲染' ? 'Jotai 对象状态' : '无意义渲染',
							}));
						}}
						variant='default'
						className='w-full'
					>
						切换名称
					</Button>
					<Button
						onClick={() => {
							setData((draft) => {
								draft.tags.push(`tag${draft.tags.length + 1}`);
							});
						}}
						variant='secondary'
						className='w-full'
					>
						追加标签
					</Button>
				</div>

				<div className='mt-6 rounded-lg bg-yellow-50 p-4'>
					<p className='text-sm text-yellow-800'>
						💡 打开控制台查看组件渲染日志，观察使用 Jotai + Immer
						如何避免不必要的重渲染
					</p>
				</div>
			</div>
		</div>
	);
};

Index.whyDidYouRender = true;
export default Index;
