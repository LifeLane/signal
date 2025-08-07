
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Wallets are now auto-discovered by the Wallet Adapter, so we don't need to
// import and list them manually unless we want to override the default behavior.
// This new approach is more robust and avoids conflicts with multiple injected wallets.

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Mainnet;

    // Use a custom RPC endpoint from environment variables for reliability.
    // Fallback to the public RPC for basic functionality.
    const endpoint = useMemo(() => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network), [network]);
    
    // The `wallets` prop is now omitted. The WalletProvider will automatically
    // detect installed wallet extensions that follow the Solana wallet standard.
    // This prevents conflicts between extensions like Phantom and Binance Wallet.
    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
}
