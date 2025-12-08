import type { Eip1193Provider } from 'ethers';

declare global {
	interface Window {
		ethereum?: Eip1193Provider & {
			request: (args: {
				method: string;
				params?: unknown[];
			}) => Promise<unknown>;
			on(
				event: 'accountsChanged',
				callback: (accounts: string[]) => void
			): void;
			on(event: 'chainChanged', callback: (chainId: string) => void): void;
			on(event: string, callback: (...args: unknown[]) => void): void;
			removeAllListeners: (event: string) => void;
		};
	}
}
