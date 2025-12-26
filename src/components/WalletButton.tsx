import {
	formatAddress,
	formatBalance,
	getChainName,
	weiToEther,
} from '@zack/libs';
import { Button } from '@zack/ui';
import { BrowserProvider, type Eip1193Provider } from 'ethers';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { walletAtom } from '@/stores';

declare global {
	interface Window {
		ethereum?: Eip1193Provider & {
			on: (event: string, handler: (params: unknown) => void) => void;
			removeListener: (
				event: string,
				handler: (params: unknown) => void
			) => void;
			removeAllListeners?: (event: string) => void;
		};
	}
}

const WalletButton = () => {
	const [wallet, setWallet] = useAtom(walletAtom);

	// 检查是否安装了 MetaMask
	const isMetaMaskInstalled = useCallback(() => {
		return typeof window.ethereum !== 'undefined';
	}, []);

	// 连接钱包
	const connectWallet = useCallback(async () => {
		if (!isMetaMaskInstalled()) {
			setWallet((draft) => {
				draft.error = '请先安装 MetaMask 钱包';
			});
			return;
		}

		try {
			setWallet((draft) => {
				draft.isConnecting = true;
				draft.error = null;
			});

			const provider = new BrowserProvider(window.ethereum as Eip1193Provider);

			// 请求账户访问
			const accounts = await provider.send('eth_requestAccounts', []);
			const address = accounts[0];

			// 获取余额
			const balance = await provider.getBalance(address);
			const balanceInEther = weiToEther(balance.toString());

			// 获取链 ID
			const network = await provider.getNetwork();
			const chainId = Number(network.chainId);

			setWallet((draft) => {
				draft.address = address;
				draft.balance = balanceInEther;
				draft.chainId = chainId;
				draft.isConnecting = false;
			});
		} catch (error) {
			console.error('连接钱包失败:', error);
			setWallet((draft) => {
				draft.error = error instanceof Error ? error.message : '连接钱包失败';
				draft.isConnecting = false;
			});
		}
	}, [isMetaMaskInstalled, setWallet]);

	// 断开连接
	const disconnectWallet = useCallback(() => {
		setWallet((draft) => {
			draft.address = null;
			draft.balance = null;
			draft.chainId = null;
			draft.error = null;
		});
	}, [setWallet]);

	// 监听账户变化
	useEffect(() => {
		if (!window.ethereum) return;

		const handleAccountsChanged = (params: unknown) => {
			const accounts = params as string[];
			if (accounts.length === 0) {
				disconnectWallet();
			} else {
				connectWallet();
			}
		};

		const handleChainChanged = () => {
			connectWallet();
		};

		window.ethereum.on('accountsChanged', handleAccountsChanged);
		window.ethereum.on('chainChanged', handleChainChanged);

		return () => {
			window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
			window.ethereum?.removeListener('chainChanged', handleChainChanged);
		};
	}, [connectWallet, disconnectWallet]);

	// 自动连接（如果之前已连接）
	useEffect(() => {
		const autoConnect = async () => {
			if (!isMetaMaskInstalled()) return;

			try {
				const provider = new BrowserProvider(
					window.ethereum as Eip1193Provider
				);
				const accounts = await provider.send('eth_accounts', []);
				if (accounts.length > 0) {
					connectWallet();
				}
			} catch (error) {
				console.error('自动连接失败:', error);
			}
		};

		autoConnect();
	}, [connectWallet, isMetaMaskInstalled]);

	if (!wallet.address) {
		return (
			<div className='flex flex-col items-start gap-3'>
				<Button
					onClick={connectWallet}
					disabled={wallet.isConnecting}
					size='lg'
					className='min-w-[160px]'
				>
					{wallet.isConnecting ? '连接中...' : '连接钱包'}
				</Button>
				{wallet.error && (
					<div className='rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800'>
						{wallet.error}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className='inline-flex items-center gap-4 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-md'>
			<div className='flex flex-col items-start gap-1'>
				<div className='text-xs font-medium text-gray-600'>
					{wallet.chainId && getChainName(wallet.chainId)}
				</div>
				<div className='text-lg font-bold text-gray-900'>
					{formatBalance(wallet.balance || '0', 4)} ETH
				</div>
			</div>
			<div className='rounded-lg bg-white px-4 py-2 font-mono text-sm font-medium text-gray-900 shadow-sm'>
				{formatAddress(wallet.address)}
			</div>
			<Button
				onClick={disconnectWallet}
				variant='outline'
				size='sm'
				className='border-gray-300'
			>
				断开
			</Button>
		</div>
	);
};

export default WalletButton;
