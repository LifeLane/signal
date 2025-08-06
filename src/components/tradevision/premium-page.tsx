
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { VersionedTransaction, TransactionMessage, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import bs58 from 'bs58';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Wallet, ArrowRight, Zap, ShieldCheck, Loader, LogOut } from 'lucide-react';
import type { Theme } from './tradevision-page';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

const SHADOW_TOKEN_MINT = new PublicKey("B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR");
const SOL_TOKEN_MINT = "So11111111111111111111111111111111111111112";
const SHADOW_TOKEN_DECIMALS = 6;
const SOL_TOKEN_DECIMALS = 9;
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

// Simple debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export function PremiumPage({ theme }: PremiumPageProps) {
  const { publicKey, connected, signTransaction, sendTransaction, disconnect } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('SHADOW');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [quote, setQuote] = useState<any | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

  const getQuote = async (amount: number) => {
    if (amount <= 0) {
      setToAmount('');
      setQuote(null);
      return;
    }
    setIsFetchingQuote(true);
    try {
      const amountInLamports = Math.round(amount * (10 ** SOL_TOKEN_DECIMALS));
      const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${SOL_TOKEN_MINT}&outputMint=${SHADOW_TOKEN_MINT.toBase58()}&amount=${amountInLamports}&slippageBps=50`);
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json();
      setQuote(data);
      if (data.outAmount) {
        setToAmount((parseInt(data.outAmount) / (10 ** SHADOW_TOKEN_DECIMALS)).toFixed(4));
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Error Fetching Quote", description: e.message });
      setToAmount('');
      setQuote(null);
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const debouncedGetQuote = useMemo(() => debounce(getQuote, 500), []);

  useEffect(() => {
    const amount = parseFloat(fromAmount);
    if (!isNaN(amount)) {
      debouncedGetQuote(amount);
    } else {
      setToAmount('');
      setQuote(null);
    }
  }, [fromAmount, debouncedGetQuote]);


  const handleSwap = async () => {
    if (!publicKey || !quote || !signTransaction) {
      toast({ variant: 'destructive', title: "Swap Error", description: "Wallet not connected or quote not available." });
      return;
    }
    setIsSwapping(true);
    try {
        const { swapTransaction } = await (await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteResponse: quote,
                userPublicKey: publicKey.toBase58(),
                wrapAndUnwrapSol: true,
            })
        })).json();

        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        // sign the transaction
        const signedTransaction = await signTransaction(transaction);

        const rawTransaction = signedTransaction.serialize()

        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
        });

        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid
        }, 'confirmed');

        toast({ title: "Swap Successful!", description: `Transaction ID: ${txid.substring(0,10)}...`, action: (
            <a href={`https://solscan.io/tx/${txid}`} target="_blank" rel="noopener noreferrer" className="text-white underline">View on Solscan</a>
        ) });

    } catch (e: any) {
        console.error("Swap failed", e);
        toast({ variant: 'destructive', title: "Swap Failed", description: e.message || "An unknown error occurred." });
    } finally {
        setIsSwapping(false);
        setFromAmount('');
        setToAmount('');
        setQuote(null);
    }
  };

    const handleSubscription = async (tierName: string, amount: number) => {
        if (!publicKey || !sendTransaction) {
            toast({ variant: 'destructive', title: 'Subscription Error', description: 'Please connect your wallet to subscribe.' });
            return;
        }

        if (amount === 0) {
            toast({ title: "Free Trial Activated!", description: "Enjoy your 7-day trial of SHADOW."});
            return;
        }

        setIsSubscribing(tierName);
        try {
            // Get the sender's token account address.
            const fromTokenAccountAddress = await getAssociatedTokenAddress(SHADOW_TOKEN_MINT, publicKey);
            
            // Get the creator's token account address.
            const toTokenAccountAddress = await getAssociatedTokenAddress(SHADOW_TOKEN_MINT, CREATOR_WALLET_ADDRESS);

            // Check if the creator has a token account, if not, create one.
            const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccountAddress);
            
            const instructions = [];

            if (!toTokenAccountInfo) {
               instructions.push(
                    createAssociatedTokenAccountInstruction(
                        publicKey, 
                        toTokenAccountAddress, 
                        CREATOR_WALLET_ADDRESS, 
                        SHADOW_TOKEN_MINT 
                    )
                );
            }
            
            instructions.push(
                createTransferInstruction(
                    fromTokenAccountAddress,
                    toTokenAccountAddress,
                    publicKey,
                    BigInt(amount * (10 ** SHADOW_TOKEN_DECIMALS))
                )
            );

            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
            
            const messageV0 = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: blockhash,
                instructions,
            }).compileToV0Message();

            const transaction = new VersionedTransaction(messageV0);

            const signature = await sendTransaction(transaction, connection, { skipPreflight: true });

            await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');


            toast({ title: "Subscription Successful!", description: `Thank you for subscribing to ${tierName}! Tx: ${signature.substring(0, 10)}...`, action: (
                <a href={`https://solscan.io/tx/${signature}`} target="_blank" rel="noopener noreferrer" className="text-white underline">View on Solscan</a>
            )});

        } catch (error: any) {
            console.error("Subscription failed:", error);
            toast({
                variant: 'destructive',
                title: 'Subscription Failed',
                description: error?.message || 'An unknown error occurred during the transaction.',
            });
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

        {connected && (
            <Card className={cn('bg-card', theme === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.green.500/0.7)]')}>
                <CardHeader>
                    <CardTitle>2. Get SHADOW Tokens</CardTitle>
                    <CardDescription>Swap SOL for SHADOW to unlock premium access. Powered by Jupiter.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="from-amount">You Pay</Label>
                        <div className="flex gap-2">
                            <Input id="from-amount" type="number" placeholder="0.0" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} disabled={isSwapping}/>
                            <Button variant="outline" className="min-w-[100px]">{fromToken}</Button>
                        </div>
                    </div>

                    <div className="flex justify-center my-2">
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="to-amount">You Receive</Label>
                         <div className="relative flex gap-2">
                            <Input id="to-amount" type="number" placeholder="0.0" value={toAmount} readOnly disabled={isSwapping}/>
                            {isFetchingQuote && <Loader className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin"/>}
                            <Button variant="outline" className="min-w-[100px]">{toToken}</Button>
                        </div>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleSwap} disabled={!connected || !quote || fromAmount === '' || isFetchingQuote || isSwapping}>
                        {isSwapping ? <Loader className="animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                        {isSwapping ? 'Swapping...' : 'Swap Tokens'}
                    </Button>
                </CardContent>
            </Card>
        )}

        <Card className='bg-transparent border-none shadow-none'>
            <CardHeader className='text-center'>
                <CardTitle>
                    {connected ? "3. Choose Your Plan" : "2. Choose Your Plan"}
                </CardTitle>
                <CardDescription>Select the plan that best fits your trading style.</CardDescription>
            </CardHeader>
        </Card>

        <Card key={trialTier.name} className={cn('bg-card/50 border-primary/50 border-dashed')}>
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
                <Button variant='outline' className="w-full" onClick={() => handleSubscription(trialTier.name, trialTier.price)} disabled={!connected || !!isSubscribing}>
                   {isSubscribing === trialTier.name ? <Loader className="animate-spin" /> : <Gem className="mr-2 h-4 w-4" />} 
                   {isSubscribing === trialTier.name ? 'Processing...' : trialTier.cta}
                </Button>
            </CardFooter>
        </Card>

        <Separator />

        <div className="grid grid-cols-1 gap-6">
            {subscriptionTiers.map(tier => (
                <Card key={tier.name} className={cn(
                    'bg-card flex flex-col',
                    tier.popular && 'border-primary ring-2 ring-primary',
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
                        <Button className="w-full" onClick={() => handleSubscription(tier.name, tier.price)} disabled={!connected || !!isSubscribing}>
                           {isSubscribing === tier.name ? <Loader className="animate-spin" /> : <Gem className="mr-2 h-4 w-4" />} 
                           {isSubscribing === tier.name ? 'Processing...' : tier.cta}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>

        <div className="h-12"></div>
    </div>
  );
}
