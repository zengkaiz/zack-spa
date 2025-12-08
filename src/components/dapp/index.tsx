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
		<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
			<h1>InfoContract DApp</h1>

			{/* 钱包连接状态 */}
			<div
				style={{
					marginBottom: '20px',
					padding: '10px',
					background: '#f0f0f0',
					borderRadius: '5px',
				}}
			>
				{account ? (
					<div>
						<p>
							<strong>已连接账户:</strong> {account}
						</p>
						<p>
							<strong>合约地址:</strong> {CONTRACT_ADDRESS}
						</p>
					</div>
				) : (
					<button
						type='button'
						onClick={connectWallet}
						style={{ padding: '10px 20px', cursor: 'pointer' }}
					>
						连接钱包
					</button>
				)}
			</div>

			{/* 设置信息 */}
			{account && (
				<div style={{ marginBottom: '20px' }}>
					<h3>设置信息</h3>
					<div style={{ marginBottom: '10px' }}>
						<input
							type='text'
							placeholder='姓名'
							value={name}
							onChange={(e) => setName(e.target.value)}
							style={{ padding: '5px', marginRight: '10px', width: '200px' }}
						/>
						<input
							type='number'
							placeholder='年龄'
							value={age || ''}
							onChange={(e) => setAge(Number(e.target.value))}
							style={{ padding: '5px', width: '100px' }}
						/>
					</div>
					<button
						type='button'
						onClick={handleSetInfo}
						disabled={loading}
						style={{
							padding: '10px 20px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						{loading ? '处理中...' : '设置信息'}
					</button>
				</div>
			)}

			{/* 获取信息 */}
			{account && (
				<div style={{ marginBottom: '20px' }}>
					<h3>获取信息</h3>
					<button
						type='button'
						onClick={handleGetInfo}
						disabled={loading}
						style={{
							padding: '10px 20px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						{loading ? '加载中...' : '获取信息'}
					</button>
					{currentInfo && (
						<div
							style={{
								marginTop: '10px',
								padding: '10px',
								background: '#e8f5e9',
								borderRadius: '5px',
							}}
						>
							<p>
								<strong>姓名:</strong> {currentInfo.name}
							</p>
							<p>
								<strong>年龄:</strong> {currentInfo.age.toString()}
							</p>
						</div>
					)}
				</div>
			)}

			{/* SayHi */}
			{account && (
				<div style={{ marginBottom: '20px' }}>
					<h3>打招呼</h3>
					<button
						type='button'
						onClick={handleSayHi}
						disabled={loading}
						style={{ padding: '10px 20px', cursor: 'pointer' }}
					>
						{loading ? '调用中...' : '调用 sayHi'}
					</button>
				</div>
			)}
		</div>
	);
};

export default Index;
