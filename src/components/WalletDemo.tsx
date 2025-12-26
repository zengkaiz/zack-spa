import {
	formatAddress,
	formatBalance,
	getAddressExplorerLink,
} from '@zack/libs';
import { useAtom } from 'jotai';
import { WalletButton } from '@/components';
import { walletAtom } from '@/stores';

const WalletDemo = () => {
	const [wallet] = useAtom(walletAtom);

	return (
		<div className='space-y-6'>
			<div className='rounded-lg border border-gray-200 bg-white p-6'>
				<WalletButton />
			</div>

			{wallet.address && (
				<div className='rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm'>
					<h4 className='mb-4 text-lg font-semibold text-gray-900'>钱包信息</h4>
					<div className='space-y-3'>
						<div className='flex items-center justify-between rounded-lg bg-white p-4 shadow-sm'>
							<span className='font-medium text-gray-700'>地址:</span>
							<span className='font-mono text-sm text-gray-900'>
								{wallet.address}
							</span>
						</div>
						<div className='flex items-center justify-between rounded-lg bg-white p-4 shadow-sm'>
							<span className='font-medium text-gray-700'>格式化地址:</span>
							<span className='font-mono text-sm text-gray-900'>
								{formatAddress(wallet.address)}
							</span>
						</div>
						<div className='flex items-center justify-between rounded-lg bg-white p-4 shadow-sm'>
							<span className='font-medium text-gray-700'>余额:</span>
							<span className='text-lg font-bold text-gray-900'>
								{formatBalance(wallet.balance || '0', 6)} ETH
							</span>
						</div>
						<div className='flex items-center justify-between rounded-lg bg-white p-4 shadow-sm'>
							<span className='font-medium text-gray-700'>链 ID:</span>
							<span className='font-semibold text-gray-900'>
								{wallet.chainId}
							</span>
						</div>
						{wallet.chainId && (
							<div className='flex items-center justify-between rounded-lg bg-white p-4 shadow-sm'>
								<span className='font-medium text-gray-700'>区块链浏览器:</span>
								<a
									href={getAddressExplorerLink(wallet.address, wallet.chainId)}
									target='_blank'
									rel='noopener noreferrer'
									className='font-medium text-blue-600 hover:text-blue-700 hover:underline'
								>
									查看地址 →
								</a>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default WalletDemo;
