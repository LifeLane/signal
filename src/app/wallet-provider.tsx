
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
    PhantomWalletAdapter
} from '@solana/wallet-adapter-phantom';
import {
    SolflareWalletAdapter
} from '@solana/wallet-adapter-solflare';
import {
    TorusWalletAdapter
} from '@solana/wallet-adapter-torus';


// This provider component wraps the application with the necessary Solana wallet context providers.
// By explicitly defining the supported wallets, we avoid issues with auto-detection when multiple wallet extensions are installed.
export function WalletProvider({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Mainnet;

    // Use a custom RPC endpoint from environment variables for better reliability,
    // falling back to the public RPC if it's not set.
    const endpoint = useMemo(() => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network), [network]);

    // Define the list of wallets to support explicitly.
    // This provides a consistent user experience and avoids auto-detection conflicts.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
}
