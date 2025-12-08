// import { useState } from 'react';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { productAtomWithImmer } from '@/stores';

const Index = () => {
	// const [data, setData] = useImmer({ zack: '无意义渲染' });
	// const [data, setDataa] = useAtom(productAtom);
	const [data, setData] = useAtom(productAtomWithImmer);
	useEffect(() => {
		console.log('demo render');
		return () => {
			// 去掉无意义的监听
			console.log('demo unmount');
		};
	}, []);
	return (
		<div>
			<p>{data.name}</p>
			<p>{data.tags.join(',')}</p>
			<button
				type='button'
				onClick={() => {
					// setData({ zack: '无意义渲染' });
					// setData((draft) => {
					// 	draft.zack = '无意义渲染';
					// });
					setData((prev) => ({
						...prev,
						zack: prev.name === '无意义渲染' ? 'Jotai 对象状态' : '无意义渲染',
					}));
				}}
			>
				切换名称
			</button>
			<button
				type='button'
				onClick={() => {
					setData((draft) => {
						draft.tags.push(`tag${draft.tags.length + 1}`);
					});
				}}
			>
				追加标签
			</button>
		</div>
	);
};
Index.whyDidYouRender = true;
export default Index;
