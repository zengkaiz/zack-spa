import { Button, Input, Label } from '@zack/ui';
import { BrowserProvider } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import InfoContractABI from '@/abis/InfoContract.json';
import type { InfoContract } from '@/types/typechain-types';
import { InfoContract__factory } from '@/types/typechain-types';

const CONTRACT_ADDRESS = InfoContractABI.networks['5777'].address;

const Index = () => {
	const [account, setAccount] = useState<string>('');
	const [contract, setContract] = useState<InfoContract | null>(null);
	const [name, setName] = useState<string>('');
	const [age, setAge] = useState<number>(0);
	const [currentInfo, setCurrentInfo] = useState<{
		name: string;
		age: bigint;
	} | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	// 连接钱包
	const connectWallet = useCallback(async () => {
		try {
			if (typeof window.ethereum === 'undefined') {
				alert('请安装 MetaMask!');
				return;
			}

			// 请求账户访问
			const accounts = await window.ethereum.request({
				method: 'eth_requestAccounts',
			});

			// 创建provider和signer
			const browserProvider = new BrowserProvider(window.ethereum);
			const signer = await browserProvider.getSigner();

			// 连接合约
			const contractInstance = InfoContract__factory.connect(
				CONTRACT_ADDRESS,
				signer
			);

			setAccount(accounts[0] as string);
			setContract(contractInstance);

			console.log('钱包已连接:', accounts[0]);
		} catch (error) {
			console.error('连接钱包失败:', error);
			alert('连接钱包失败');
		}
	}, []);

	// 监听账户变化
	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', (accounts: string[]) => {
				if (accounts.length > 0) {
					setAccount(accounts[0]);
					connectWallet();
				} else {
					setAccount('');
					setContract(null);
				}
			});

			window.ethereum.on('chainChanged', () => {
				window.location.reload();
			});
		}

		return () => {
			if (window.ethereum) {
				window.ethereum.removeAllListeners('accountsChanged');
				window.ethereum.removeAllListeners('chainChanged');
			}
		};
	}, [connectWallet]);

	// 设置信息
	const handleSetInfo = async () => {
		if (!contract) {
			alert('请先连接钱包');
			return;
		}

		if (!name || age <= 0) {
			alert('请输入有效的姓名和年龄');
			return;
		}

		try {
			setLoading(true);
			const tx = await contract.setInfo(name, age);
			console.log('交易已发送:', tx.hash);

			await tx.wait();
			console.log('交易已确认');

			alert('信息设置成功!');
			// 设置成功后获取最新信息
			await handleGetInfo();
		} catch (error) {
			console.error('设置信息失败:', error);
			alert('设置信息失败');
		} finally {
			setLoading(false);
		}
	};

	// 获取信息
	const handleGetInfo = async () => {
		if (!contract) {
			alert('请先连接钱包');
			return;
		}

		try {
			setLoading(true);
			const info = await contract.getInfo();
			setCurrentInfo({
				name: info[0],
				age: info[1],
			});
			console.log('当前信息:', info);
		} catch (error) {
			console.error('获取信息失败:', error);
			alert('获取信息失败');
		} finally {
			setLoading(false);
		}
	};

	// 调用sayHi
	const handleSayHi = async () => {
		if (!contract) {
			alert('请先连接钱包');
			return;
		}

		try {
			setLoading(true);
			const greeting = await contract.sayHi();
			alert(`合约说: ${greeting}`);
			console.log('sayHi返回:', greeting);
		} catch (error) {
			console.error('调用sayHi失败:', error);
			alert('调用sayHi失败');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='mb-6'>
				<h3 className='text-2xl font-bold text-gray-900'>InfoContract DApp</h3>
				<p className='mt-2 text-sm text-gray-600'>
					与智能合约交互示例 - 存储和读取链上信息
				</p>
			</div>

			{/* 钱包连接状态 */}
			<div className='rounded-lg bg-gray-50 p-5'>
				{account ? (
					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<span className='text-sm font-medium text-gray-700'>
								已连接账户:
							</span>
							<span className='font-mono text-sm text-gray-900'>{account}</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm font-medium text-gray-700'>
								合约地址:
							</span>
							<span className='font-mono text-sm text-gray-900'>
								{CONTRACT_ADDRESS}
							</span>
						</div>
					</div>
				) : (
					<div className='text-center'>
						<p className='mb-4 text-sm text-gray-600'>请先连接 MetaMask 钱包</p>
						<Button onClick={connectWallet} size='lg'>
							连接钱包
						</Button>
					</div>
				)}
			</div>

			{/* 设置信息 */}
			{account && (
				<div className='space-y-4 rounded-lg border border-gray-200 bg-white p-6'>
					<h4 className='text-lg font-semibold text-gray-900'>设置信息</h4>
					<div className='grid gap-4 md:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='name'>姓名</Label>
							<Input
								id='name'
								type='text'
								placeholder='请输入姓名'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='age'>年龄</Label>
							<Input
								id='age'
								type='number'
								placeholder='请输入年龄'
								value={age || ''}
								onChange={(e) => setAge(Number(e.target.value))}
							/>
						</div>
					</div>
					<Button onClick={handleSetInfo} disabled={loading} className='w-full'>
						{loading ? '处理中...' : '设置信息'}
					</Button>
				</div>
			)}

			{/* 获取信息 */}
			{account && (
				<div className='space-y-4 rounded-lg border border-gray-200 bg-white p-6'>
					<h4 className='text-lg font-semibold text-gray-900'>获取信息</h4>
					<Button
						onClick={handleGetInfo}
						disabled={loading}
						variant='outline'
						className='w-full'
					>
						{loading ? '加载中...' : '获取信息'}
					</Button>
					{currentInfo && (
						<div className='rounded-lg bg-green-50 p-4'>
							<div className='space-y-2'>
								<div className='flex justify-between'>
									<span className='font-medium text-gray-700'>姓名:</span>
									<span className='text-gray-900'>{currentInfo.name}</span>
								</div>
								<div className='flex justify-between'>
									<span className='font-medium text-gray-700'>年龄:</span>
									<span className='text-gray-900'>
										{currentInfo.age.toString()}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			)}

			{/* SayHi */}
			{account && (
				<div className='space-y-4 rounded-lg border border-gray-200 bg-white p-6'>
					<h4 className='text-lg font-semibold text-gray-900'>打招呼</h4>
					<Button
						onClick={handleSayHi}
						disabled={loading}
						variant='secondary'
						className='w-full'
					>
						{loading ? '调用中...' : '调用 sayHi'}
					</Button>
				</div>
			)}
		</div>
	);
};

export default Index;
