import { atom } from 'jotai';
import type { InfoContract } from '@/types/typechain-types';

// DApp状态类型定义
export interface DAppState {
	account: string;
	contract: InfoContract | null;
	isConnected: boolean;
	chainId: string | null;
	balance: string;
	userInfo: {
		name: string;
		age: number;
	} | null;
}

// 初始状态
export const initialDAppState: DAppState = {
	account: '',
	contract: null,
	isConnected: false,
	chainId: null,
	balance: '0',
	userInfo: null,
};

// 创建DApp状态atom
export const dappAtom = atom<DAppState>(initialDAppState);

// 派生atoms - 只读的计算属性
export const accountAtom = atom((get) => get(dappAtom).account);
export const isConnectedAtom = atom((get) => get(dappAtom).isConnected);
export const contractAtom = atom((get) => get(dappAtom).contract);
export const userInfoAtom = atom((get) => get(dappAtom).userInfo);

// 操作atoms - 可写的
export const setAccountAtom = atom(null, (get, set, account: string) => {
	set(dappAtom, {
		...get(dappAtom),
		account,
		isConnected: !!account,
	});
});

export const setContractAtom = atom(
	null,
	(get, set, contract: InfoContract | null) => {
		set(dappAtom, {
			...get(dappAtom),
			contract,
		});
	}
);

export const setUserInfoAtom = atom(
	null,
	(get, set, userInfo: { name: string; age: number } | null) => {
		set(dappAtom, {
			...get(dappAtom),
			userInfo,
		});
	}
);

export const setChainIdAtom = atom(null, (get, set, chainId: string | null) => {
	set(dappAtom, {
		...get(dappAtom),
		chainId,
	});
});

export const setBalanceAtom = atom(null, (get, set, balance: string) => {
	set(dappAtom, {
		...get(dappAtom),
		balance,
	});
});

// 重置状态
export const resetDAppStateAtom = atom(null, (_get, set) => {
	set(dappAtom, initialDAppState);
});

// 复合操作 - 断开连接
export const disconnectWalletAtom = atom(null, (_get, set) => {
	set(dappAtom, initialDAppState);
});
