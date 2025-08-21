
'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { VersionedTransaction, TransactionMessage, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getShadowDetailsAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Wallet, ShieldCheck, Loader, LogOut, Info, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';

const CREATOR_WALLET_ADDRESS = new PublicKey(process.env.NEXT_PUBLIC_CREATOR_WALLET_ADDRESS || "38XnV4BZownmFeFrykAYhfMJvWxaZ31t4zBa96HqChEe");
const SHADOW_MINT_ADDRESS = new PublicKey("B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR");


type Tier = {
    name: string;
    shadowPrice: number; // Price in SHADOW tokens
    solPrice?: number; // Equivalent price in SOL
    priceLabel: string;
    features: string[];
    cta: string;
    popular?: boolean;
    hook: string;
};

const subscriptionTiers: Tier[] = [
    {
        name: "Monthly Pro",
        shadowPrice: 100_000,
        priceLabel: "100K SHADOW",
        features: ["Unlimited AI Signals", "Priority Analysis", "All Premium Features"],
        cta: "Go Monthly",
        popular: true,
        hook: "Best for active traders."
    },
    {
        name: "Yearly Elite",
        shadowPrice: 1_000_000,
        priceLabel: "1 Million SHADOW",
        features: ["12 Months for the Price of 10", "Everything in Monthly Pro", "Exclusive Future Updates"],
        cta: "Go Yearly",
        hook: "Best value & long-term growth."
    },
    {
        name: "Lifetime Access",
        shadowPrice: 10_000_000,
        priceLabel: "10 Million SHADOW",
        features: ["One-Time Payment, Forever", "Everything in Yearly Elite", "Become a SHADOW OG"],
        cta: "Go Lifetime",
        hook: "For the ultimate conviction."
    },
]

const getShadowBalance = async (connection: any, walletPublicKey: PublicKey): Promise<number> => {
    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
            mint: SHADOW_MINT_ADDRESS,
        });

        if (tokenAccounts.value.length > 0) {
            const accountInfo = tokenAccounts.value[0].account.data.parsed.info;
            return accountInfo.tokenAmount.uiAmount;
        }
        return 0;
    } catch (error) {
        console.error("Error getting SHADOW balance:", error);
        return 0;
    }
};


export function PremiumPage() {
  const { publicKey, connected, sendTransaction, disconnect } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<string | null>(null);
  const [shadowToSolPrice, setShadowToSolPrice] = useState<number | null>(null);
  const [isPriceLoading, startPriceTransition] = useTransition();
  const [shadowBalance, setShadowBalance] = useState<number | null>(null);

  const fetchPrices = useCallback(() => {
    startPriceTransition(async () => {
        try {
            const details = await getShadowDetailsAction();
            if (details.solPrice) {
                setShadowToSolPrice(details.solPrice);
            } else {
                 toast({ variant: 'destructive', title: 'Pricing Error', description: 'Could not fetch live SHADOW to SOL price.' });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'API Error', description: 'Could not fetch token prices.' });
        }
    });
  }, [toast]);


  const checkBalance = useCallback(async () => {
      if(publicKey) {
        const balance = await getShadowBalance(connection, publicKey);
        setShadowBalance(balance);
      }
  }, [publicKey, connection]);

  useEffect(() => {
    fetchPrices();
    if (!process.env.NEXT_PUBLIC_CREATOR_WALLET_ADDRESS) {
        console.warn("NEXT_PUBLIC_CREATOR_WALLET_ADDRESS is not set in .env. Using default address.");
    }
  }, [fetchPrices]);

  useEffect(() => {
      if(connected && publicKey) {
          checkBalance();
      } else {
          setShadowBalance(null);
      }
  }, [connected, publicKey, checkBalance])


  const handleSubscription = async (tier: Tier) => {
    
    // Wildcard entry for holders
    if (shadowBalance && shadowBalance >= tier.shadowPrice) {
        setIsSubscribing(tier.name);
        // Simulate activation
        setTimeout(() => {
            toast({ title: "Holder Access Granted!", description: `Your SHADOW holdings have granted you free access to ${tier.name}!`});
            setActiveSubscription(tier.name);
            setIsSubscribing(null);
        }, 1000)
        return;
    }

    if (!publicKey || !shadowToSolPrice) {
        toast({ variant: 'destructive', title: 'Subscription Error', description: 'Please connect your wallet and wait for price data to load.' });
        return;
    }
    
    setIsSubscribing(tier.name);

    if (!sendTransaction) {
        toast({ variant: 'destructive', title: 'Wallet Error', description: 'The connected wallet does not support sending transactions.' });
        setIsSubscribing(null);
        return;
    }

    const solAmount = tier.shadowPrice * shadowToSolPrice;
    
    try {
        const lamports = Math.ceil(solAmount * LAMPORTS_PER_SOL);
        
        const instruction = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: CREATOR_WALLET_ADDRESS,
            lamports: lamports,
        });

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        
        const messageV0 = new TransactionMessage({
            payerKey: publicKey,
            recentBlockhash: blockhash,
            instructions: [instruction],
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        
        const signature = await sendTransaction(transaction, connection);
        
        await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');

        toast({ title: "Subscription Successful!", description: `Thank you for subscribing to ${tier.name}! Tx: ${signature.substring(0, 10)}...`, action: (
            <a href={`https://solscan.io/tx/${signature}?cluster=mainnet`} target="_blank" rel="noopener noreferrer" className="text-white underline">View on Solscan</a>
        )});
        setActiveSubscription(tier.name);

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

  const renderPrice = (tierPrice: number) => {
    if (isPriceLoading || !shadowToSolPrice) {
        return <Skeleton className='h-5 w-24 mt-1' />;
    }
    const solAmount = (tierPrice * shadowToSolPrice).toFixed(4);
    return (
        <>
            <span className="text-2xl font-bold">{tierPrice.toLocaleString()} SHADOW</span>
            <span className='text-base text-muted-foreground'>~{solAmount} SOL</span>
        </>
    )
  }


  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar bg-pulse-grid">
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

        <Card className="bg-card animate-pulse-glow [--glow-color:theme(colors.blue.500/0.7)]">
            <CardHeader>
                <CardTitle>1. Connect Your Wallet</CardTitle>
                <CardDescription>
                    {connected ? "Your wallet is connected." : "Connect your Solana wallet to get started."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {connected && publicKey ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20 text-green-400">
                            <div className='flex items-center'>
                               <Check className="mr-2 h-5 w-5" />
                               <span className='font-semibold'>Wallet Connected</span>
                            </div>
                            <Button variant='ghost' size='icon' onClick={disconnect} className="text-green-400 hover:text-white h-7 w-7">
                                <LogOut className='h-5 w-5' />
                            </Button>
                        </div>
                        {shadowBalance !== null ? (
                            <Alert variant='default' className='border-primary/50'>
                                <Coins className='h-5 w-5 text-primary' />
                                <AlertTitle>SHADOW Balance</AlertTitle>
                                <AlertDescription>
                                    You are holding <strong>{shadowBalance.toLocaleString()} SHADOW</strong>. Holders get wildcard access to the ecosystem.
                                </AlertDescription>
                            </Alert>
                        ) : (
                             <Alert variant='default' className='border-primary/50'>
                                <Loader className='h-5 w-5 text-primary animate-spin' />
                                <AlertTitle>Checking SHADOW Balance...</AlertTitle>
                            </Alert>
                        )}
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
        
        <Card className='bg-transparent border-none shadow-none'>
            <CardHeader className='text-center'>
                <CardTitle>
                    {activeSubscription ? "Your Active Plan" : "2. Choose Your Plan"}
                </CardTitle>
                {!activeSubscription && (
                    <CardDescription>Hold enough SHADOW for free access, or pay the equivalent in SOL.</CardDescription>
                )}
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-6">
            {subscriptionTiers.map(tier => {
                const canActivateWithShadow = shadowBalance !== null && shadowBalance >= tier.shadowPrice;
                const ctaText = canActivateWithShadow ? "Activate with SHADOW" : tier.cta;
                const buttonDisabled = !connected || !!isSubscribing || !!activeSubscription || (isPriceLoading && !canActivateWithShadow);

                return (
                    <Card key={tier.name} className={cn(
                        'bg-card flex flex-col animate-pulse-glow [--glow-color:theme(colors.purple.500/0.7)]',
                        tier.popular && !activeSubscription && 'border-primary ring-2 ring-primary',
                        activeSubscription === tier.name && 'ring-2 ring-green-500 border-green-500'
                    )}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{tier.name}</span>
                                {tier.popular && !activeSubscription && <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded-full">POPULAR</span>}
                            </CardTitle>
                             <CardDescription asChild>
                                <div className='flex flex-col gap-1'>
                                    {renderPrice(tier.shadowPrice)}
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3">
                            <p className='text-sm text-amber-400 font-semibold'>{tier.hook}</p>
                            {canActivateWithShadow ? (
                                <Alert variant='default' className='border-green-500/50 bg-green-500/10 text-green-300'>
                                    <ShieldCheck className="h-5 w-5 text-green-400" />
                                    <AlertTitle>Holder Benefit Unlocked!</AlertTitle>
                                    <AlertDescription>
                                        You have enough SHADOW to activate this tier for free.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert variant='destructive'>
                                    <Coins className='h-5 w-5 text-amber-400' />
                                    <AlertTitle>Requirement</AlertTitle>
                                    <AlertDescription>
                                        Hold {tier.shadowPrice.toLocaleString()} SHADOW or pay in SOL.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {tier.features.map(feature => (
                                <div key={feature} className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">{feature}</span>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className={cn("w-full", canActivateWithShadow && "bg-green-600 hover:bg-green-500")}
                                onClick={() => handleSubscription(tier)} 
                                disabled={buttonDisabled}
                            >
                               {isSubscribing === tier.name ? <Loader className="animate-spin" /> : (activeSubscription === tier.name ? <Check className='mr-2 h-4 w-4' /> : <Gem className="mr-2 h-4 w-4" />)} 
                               {isSubscribing === tier.name ? 'Processing...' : (activeSubscription === tier.name ? 'Subscribed' : ctaText)}
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>

        <div className="h-12"></div>
    </div>
  );
}
    
