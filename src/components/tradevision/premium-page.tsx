
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { VersionedTransaction, TransactionMessage, PublicKey } from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import bs58 from 'bs58';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Wallet, ArrowRight, Zap, ShieldCheck, Loader, LogOut, Info } from 'lucide-react';
import type { Theme } from './tradevision-page';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const SHADOW_TOKEN_MINT = new PublicKey("B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR");
const SHADOW_TOKEN_DECIMALS = 6;
const CREATOR_WALLET_ADDRESS = new PublicKey("38XnV4BZownmFeFrykAYhfMJvWxaZ31t4zBa96HqChEe");

const subscriptionTiers = [
    {
        name: "Monthly Pro",
        price: 100_000,
        priceLabel: "100K SHADOW",
        features: ["Unlimited AI Signals", "Priority Analysis", "All Premium Features"],
        cta: "Go Monthly",
        popular: true,
        hook: "Best for active traders."
    },
    {
        name: "Yearly Elite",
        price: 1_000_000,
        priceLabel: "1 Million SHADOW",
        features: ["12 Months for the Price of 10", "Everything in Monthly Pro", "Exclusive Future Updates"],
        cta: "Go Yearly",
        hook: "Best value & long-term growth."
    },
    {
        name: "Lifetime Access",
        price: 10_000_000,
        priceLabel: "10 Million SHADOW",
        features: ["One-Time Payment, Forever", "Everything in Yearly Elite", "Become a SHADOW OG"],
        cta: "Go Lifetime",
        hook: "For the ultimate conviction."
    },
]

const trialTier = {
    name: "7-Day Free Trial",
    price: 0,
    priceLabel: "FREE",
    features: ["3 Free AI Signals", "Limited News Analysis", "Experience the power of SHADOW"],
    cta: "Start Free Trial",
    hook: "Get a taste of the future."
};


interface PremiumPageProps {
  theme: Theme;
}

export function PremiumPage({ theme }: PremiumPageProps) {
  const { publicKey, connected, sendTransaction, disconnect } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<string | null>(null);

  const handleSubscription = async (tierName: string, amount: number) => {
    if (!publicKey || !sendTransaction) {
        toast({ variant: 'destructive', title: 'Subscription Error', description: 'Please connect your wallet to subscribe.' });
        return;
    }
    
    setIsSubscribing(tierName);

    if (amount === 0) {
        toast({ title: "Free Trial Activated!", description: "Enjoy your 7-day trial of SHADOW."});
        setActiveSubscription(tierName);
        setIsSubscribing(null);
        return;
    }
    
    try {
        // 1. Get Associated Token Accounts
        const fromTokenAccountAddress = await getAssociatedTokenAddress(SHADOW_TOKEN_MINT, publicKey);
        const toTokenAccountAddress = await getAssociatedTokenAddress(SHADOW_TOKEN_MINT, CREATOR_WALLET_ADDRESS);
        
        // 2. Fetch the latest blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        
        const instructions = [];
        
        // 3. Check if recipient's ATA exists and add creation instruction if not
        const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccountAddress);
        if (!toTokenAccountInfo) {
            instructions.push(
                createAssociatedTokenAccountInstruction(
                    publicKey, // Payer
                    toTokenAccountAddress, // ATA address
                    CREATOR_WALLET_ADDRESS, // Owner
                    SHADOW_TOKEN_MINT // Mint
                )
            );
        }

        // 4. Create the main transfer instruction
        instructions.push(
            createTransferInstruction(
                fromTokenAccountAddress,
                toTokenAccountAddress,
                publicKey,
                BigInt(amount * (10 ** SHADOW_TOKEN_DECIMALS))
            )
        );
        
        // 5. Build the transaction
        const messageV0 = new TransactionMessage({
            payerKey: publicKey,
            recentBlockhash: blockhash,
            instructions: instructions,
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        
        // 6. Send the transaction using the wallet adapter
        const signature = await sendTransaction(transaction, connection);
        
        // 7. Confirm the transaction
        await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');

        toast({ title: "Subscription Successful!", description: `Thank you for subscribing to ${tierName}! Tx: ${signature.substring(0, 10)}...`, action: (
            <a href={`https://solscan.io/tx/${signature}`} target="_blank" rel="noopener noreferrer" className="text-white underline">View on Solscan</a>
        )});
        setActiveSubscription(tierName);

    } catch (error: any) {
        console.error("Subscription failed:", error);
        if (error.message?.includes('could not find account') || error.message?.includes('TokenAccountNotFoundError')) {
             toast({
                variant: 'destructive',
                title: 'Subscription Failed',
                description: 'You may not have enough SHADOW tokens, or an account error occurred. Please acquire some tokens first.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Subscription Failed',
                description: error?.message || 'An unknown error occurred during the transaction.',
            });
        }
    } finally {
        setIsSubscribing(null);
    }
  };


  return (
    <div className={cn(
        "flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar",
        theme === 'neural-pulse' && 'bg-pulse-grid'
    )}>
        <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2"><Gem className='text-primary'/> Go Premium</h1>
            <p className="text-muted-foreground mt-2">Unlock the full power of SHADOW and gain your unfair advantage.</p>
        </div>
        
        {activeSubscription && (
            <Alert variant="default" className="border-green-500/50 bg-green-500/20 text-green-300">
                <ShieldCheck className="h-5 w-5 text-green-400" />
                <AlertTitle>Subscription Active!</AlertTitle>
                <AlertDescription>
                    You are currently subscribed to the <strong>{activeSubscription}</strong> plan.
                </AlertDescription>
            </Alert>
        )}

        <Card className={cn('bg-card', theme === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.blue.500/0.7)]')}>
            <CardHeader>
                <CardTitle>1. Connect Your Wallet</CardTitle>
                <CardDescription>
                    {connected ? "Your wallet is connected." : "Connect your Solana wallet to get started."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {connected ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 text-green-400">
                        <div className='flex items-center'>
                           <Check className="mr-2 h-5 w-5" />
                           <span className='font-semibold'>Wallet Connected</span>
                        </div>
                        <Button variant='ghost' size='icon' onClick={disconnect} className="text-green-400 hover:text-white h-7 w-7">
                            <LogOut className='h-5 w-5' />
                        </Button>
                    </div>
                ) : (
                    <WalletMultiButton style={{width: '100%',
                        backgroundColor: 'hsl(var(--primary))',
                        display: 'flex',
                        justifyContent: 'center',
                        height: '44px',
                        fontSize: '1rem',
                    }}/>
                )}
            </CardContent>
        </Card>

        {/* <Card className={cn('bg-card', theme === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.green.500/0.7)]')}>
            <CardHeader>
                <CardTitle>2. Get SHADOW Tokens (Optional)</CardTitle>
                <CardDescription>Swap SOL for SHADOW to unlock premium access. Powered by Jupiter.</CardDescription>
            </CardHeader>
        </Card> */}

        <Card className='bg-transparent border-none shadow-none'>
            <CardHeader className='text-center'>
                <CardTitle>
                    {activeSubscription ? "Your Active Plan" : "2. Choose Your Plan"}
                </CardTitle>
                {!activeSubscription && (
                    <CardDescription>Select the plan that best fits your trading style.</CardDescription>
                )}
            </CardHeader>
        </Card>

        <Card key={trialTier.name} className={cn(
            'bg-card/50 border-primary/50 border-dashed',
            activeSubscription === trialTier.name && 'ring-2 ring-green-500 border-green-500'
        )}>
            <CardHeader>
                <CardTitle>{trialTier.name}</CardTitle>
                <CardDescription className="text-2xl font-bold">{trialTier.priceLabel}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                <p className='text-sm text-amber-400 font-semibold'>{trialTier.hook}</p>
                {trialTier.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button variant='outline' className="w-full" onClick={() => handleSubscription(trialTier.name, trialTier.price)} disabled={!connected || !!isSubscribing || !!activeSubscription}>
                   {isSubscribing === trialTier.name ? <Loader className="animate-spin" /> : (activeSubscription === trialTier.name ? <Check className='mr-2 h-4 w-4' /> : <Gem className="mr-2 h-4 w-4" />)} 
                   {isSubscribing === trialTier.name ? 'Processing...' : (activeSubscription === trialTier.name ? 'Trial Active' : trialTier.cta)}
                </Button>
            </CardFooter>
        </Card>

        <Separator />

        <div className="grid grid-cols-1 gap-6">
            {subscriptionTiers.map(tier => (
                <Card key={tier.name} className={cn(
                    'bg-card flex flex-col',
                    tier.popular && !activeSubscription && 'border-primary ring-2 ring-primary',
                    activeSubscription === tier.name && 'ring-2 ring-green-500 border-green-500',
                    theme === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.purple.500/0.7)]'
                )}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{tier.name}</span>
                            {tier.popular && <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded-full">POPULAR</span>}
                        </CardTitle>
                        <CardDescription className="text-2xl font-bold">{tier.priceLabel}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3">
                        <p className='text-sm text-amber-400 font-semibold'>{tier.hook}</p>
                        {tier.features.map(feature => (
                            <div key={feature} className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleSubscription(tier.name, tier.price)} disabled={!connected || !!isSubscribing || !!activeSubscription}>
                           {isSubscribing === tier.name ? <Loader className="animate-spin" /> : (activeSubscription === tier.name ? <Check className='mr-2 h-4 w-4' /> : <Gem className="mr-2 h-4 w-4" />)} 
                           {isSubscribing === tier.name ? 'Processing...' : (activeSubscription === tier.name ? 'Subscribed' : tier.cta)}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>

        <div className="h-12"></div>
    </div>
  );
}

    