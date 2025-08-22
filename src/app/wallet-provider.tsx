
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';

// This provider component wraps the application with the necessary Solana wallet context providers.
// By explicitly defining the supported wallets, we avoid issues with auto-detection when multiple wallet extensions are installed.
export function WalletProvider({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Mainnet;

    // Use a custom RPC endpoint from environment variables for better reliability.
    const endpoint = useMemo(() => {
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=a7e5148c-84ac-4475-a359-588939c4f1f3';
        return rpcUrl;
    }, []);

    // Define the list of wallets to support explicitly.
    // This provides a consistent user experience and avoids auto-detection conflicts.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new TorusWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
}

    