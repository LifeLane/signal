
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// Wallets are now auto-discovered, so we don't need to import them manually unless we want to add a wallet that doesn't follow the standard.
// import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
// import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Mainnet;

    // Use a custom RPC endpoint from environment variables for reliability.
    // Fallback to the public RPC for basic functionality.
    const endpoint = useMemo(() => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            // Wallets that support the mobile wallet standard will be automatically discovered.
            // We can still add wallets that don't follow the standard here.
            // new PhantomWalletAdapter(), // No longer needed
            // new SolflareWalletAdapter({ network }), // No longer needed
            new TorusWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
}
