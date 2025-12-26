import { atom } from 'jotai';

import { atomWithImmer } from 'jotai-immer';

export const productAtom = atom({ id: 12, name: 'good stuff' });

export type ProductState = {
	id: number;
	name: string;
	tags: string[];
};

// 使用 jotai-immer 创建可在 set 函数里直接写 "可变" 逻辑的对象状态
export const productAtomWithImmer = atomWithImmer<ProductState>({
	id: 12,
	name: '无意义渲染',
	tags: ['demo'],
});

// 钱包状态类型
export type WalletState = {
	address: string | null;
	balance: string | null;
	chainId: number | null;
	isConnecting: boolean;
	error: string | null;
};

// 钱包状态管理
export const walletAtom = atomWithImmer<WalletState>({
	address: null,
	balance: null,
	chainId: null,
	isConnecting: false,
	error: null,
});
