
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';

// This provider component wraps the application with the necessary Solana wallet context providers.
// By explicitly defining the supported wallets, we avoid issues with auto-detection when multiple wallet extensions are installed.
export function WalletProvider({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Mainnet;

    // Use a custom RPC endpoint from environment variables for better reliability.
    // The default public RPCs are heavily rate-limited. A private RPC is recommended for production.
    const endpoint = useMemo(() => {
        // It's highly recommended to use a private RPC endpoint from a provider like Helius, QuickNode, or Alchemy.
        // You can get a free one and add it to your .env.local file.
        // Example: NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=a7e5148c-84ac-4475-a359-588939c4f1f3';
        
        if (!process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
            console.warn(
                'NEXT_PUBLIC_SOLANA_RPC_URL is not set. Using a public Helius RPC. Please get your own API key for production use to avoid rate-limiting.'
            );
        }
        return rpcUrl;
    }, []);

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
                <WalletModalProvider>{children}</WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
}

    