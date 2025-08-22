
'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { VersionedTransaction, TransactionMessage, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Wallet, ShieldCheck, Loader, LogOut, Info, Coins, Star, X, Zap, Crown, Rocket, Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

const CREATOR_WALLET_ADDRESS = new PublicKey(process.env.NEXT_PUBLIC_CREATOR_WALLET_ADDRESS || "38XnV4BZownmFeFrykAYhfMJvWxaZ31t4zBa96HqChEe");
const SHADOW_MINT_ADDRESS = new PublicKey("B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR");


type Feature = { text: string; included: boolean; };
type Tier = {
    name: string;
    icon: React.ElementType;
    shadowPrice: number;
    solPrice: number; 
    priceLabel: string;
    features: Feature[];
    holderBenefits: Feature[];
    cta: string;
    popular?: boolean;
    hook: string;
};

const subscriptionTiers: Tier[] = [
    {
        name: "Initiate",
        icon: Zap,
        shadowPrice: 100_000,
        solPrice: 0.5,
        priceLabel: "100K SHADOW / 0.5 SOL",
        hook: "For the aspiring trader ready to sharpen their edge.",
        features: [
            { text: "15 AI Signals / Day", included: true },
            { text: "Standard Analysis Speed", included: true },
            { text: "Full News Sentiment Access", included: true },
            { text: "Unlimited AI Signals", included: false },
            { text: "Priority Analysis Queue", included: false },
        ],
        holderBenefits: [
            { text: "Early Access to New Indicators", included: true},
            { text: "Staking Rewards (Tier 1 APR)", included: true },
        ],
        cta: "Become an Initiate",
    },
    {
        name: "Vanguard",
        icon: Rocket,
        shadowPrice: 1_000_000,
        solPrice: 5,
        priceLabel: "1M SHADOW / 5 SOL",
        hook: "For the dedicated analyst who demands more power.",
        popular: true,
        features: [
            { text: "Unlimited AI Signals", included: true },
            { text: "Priority Analysis Queue", included: true },
            { text: "Personalized Watchlist (soon)", included: true },
            { text: "Advanced Charting Tools", included: true },
        ],
        holderBenefits: [
            { text: "Whitelist for Ecosystem Projects", included: true },
            { text: "Access to SHADOW Private Network", included: true },
            { text: "Enhanced Staking Rewards (Tier 2)", included: true },
        ],
        cta: "Join the Vanguard",
    },
    {
        name: "Shadow Elite",
        icon: Crown,
        shadowPrice: 10_000_000,
        solPrice: 10,
        priceLabel: "10M SHADOW / 10 SOL",
        hook: "For the master strategist seeking ultimate control.",
        features: [
            { text: "Everything in Vanguard", included: true },
            { text: "Lifetime Access (One-Time)", included: true },
            { text: "Direct Line to Dev Team (soon)", included: true },
            { text: "Beta Access to New AI Models", included: true },
        ],
        holderBenefits: [
            { text: "Exclusive Airdrops", included: true },
            { text: "Highest Staking Rewards (Tier 3)", included: true },
            { text: "Become a SHADOW OG", included: true },
        ],
        cta: "Become Elite",
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
  const [shadowBalance, setShadowBalance] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  const checkBalance = useCallback(async () => {
      if(publicKey) {
        setIsBalanceLoading(true);
        const balance = await getShadowBalance(connection, publicKey);
        setShadowBalance(balance);
        setIsBalanceLoading(false);
      }
  }, [publicKey, connection]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_CREATOR_WALLET_ADDRESS) {
        console.warn("NEXT_PUBLIC_CREATOR_WALLET_ADDRESS is not set in .env. Using default address.");
    }
  }, []);

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

    if (!publicKey) {
        toast({ variant: 'destructive', title: 'Subscription Error', description: 'Please connect your wallet.' });
        return;
    }
    
    setIsSubscribing(tier.name);

    if (!sendTransaction) {
        toast({ variant: 'destructive', title: 'Wallet Error', description: 'The connected wallet does not support sending transactions.' });
        setIsSubscribing(null);
        return;
    }

    const solAmount = tier.solPrice;
    
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

  const renderPrice = (tier: Tier) => {
    return (
        <div className='flex flex-col items-center text-center'>
            <span className="text-3xl font-bold">{tier.solPrice} SOL</span>
            <span className='text-sm text-muted-foreground'>or hold {tier.shadowPrice.toLocaleString()} SHADOW</span>
        </div>
    )
  }

  const FeatureItem = ({ included, text }: Feature) => (
    <div className={cn("flex items-start gap-3", !included && "text-muted-foreground")}>
        {included ? <Check className="w-5 h-5 text-green-500 mt-0.5" /> : <X className="w-5 h-5 text-red-500 mt-0.5" />}
        <span className={cn(!included && "line-through")}>{text}</span>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar bg-pulse-grid">
        <div className="sticky top-0 z-20 space-y-4 bg-background/80 backdrop-blur-md -m-4 p-4 mb-0">
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
                            {isBalanceLoading ? (
                                <Skeleton className="h-16 w-full" />
                            ) : shadowBalance !== null ? (
                                <Alert variant='default' className='border-primary/50'>
                                    <Coins className='h-5 w-5 text-primary' />
                                    <AlertTitle>SHADOW Balance: {shadowBalance.toLocaleString()}</AlertTitle>
                                    <AlertDescription>
                                        Your token holdings grant you access to exclusive benefits.
                                    </AlertDescription>
                                </Alert>
                            ) : null}
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <WalletMultiButton style={{width: '100%',
                                backgroundColor: 'hsl(var(--primary))',
                                display: 'flex',
                                justifyContent: 'center',
                                height: '44px',
                                fontSize: '1rem',
                            }}/>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2"><Gem className='text-primary'/> Go Premium</h1>
            <p className="text-muted-foreground max-w-md mx-auto">Unlock the full power of SHADOW. Gain your unfair advantage by holding SHADOW tokens or subscribing with SOL.</p>
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
        
        <div className='text-center'>
            <h2 className='text-2xl font-bold'>
                {activeSubscription ? "Your Active Plan" : "2. Choose Your Plan"}
            </h2>
            {!activeSubscription && (
                <p className='text-muted-foreground'>Select a tier to see its benefits.</p>
            )}
        </div>

        <div className="grid grid-cols-1 gap-6">
            {subscriptionTiers.map(tier => {
                const canActivateWithShadow = shadowBalance !== null && shadowBalance >= tier.shadowPrice;
                const ctaText = canActivateWithShadow ? "Activate with SHADOW" : `Subscribe for ${tier.solPrice} SOL`;
                const buttonDisabled = !connected || !!isSubscribing || !!activeSubscription || isBalanceLoading;
                const TierIcon = tier.icon;

                return (
                    <Card key={tier.name} className={cn(
                        'bg-card flex flex-col animate-pulse-glow [--glow-color:theme(colors.purple.500/0.7)] transition-all relative',
                        tier.popular && !activeSubscription && 'border-primary ring-2 ring-primary shadow-lg shadow-primary/20',
                        activeSubscription === tier.name && 'ring-2 ring-green-500 border-green-500/80 shadow-lg shadow-green-500/20'
                    )}>
                        {tier.popular && !activeSubscription && <Badge className='absolute -top-3 left-1/2 -translate-x-1/2'>Most Popular</Badge>}
                        <CardHeader className="items-center text-center">
                            <TierIcon className="w-10 h-10 mb-2 text-primary" />
                            <CardTitle className="text-2xl">{tier.name}</CardTitle>
                            <CardDescription className='text-base'>{tier.hook}</CardDescription>
                             <div className='pt-4'>
                                {renderPrice(tier)}
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 space-y-4">
                            
                           <div className="space-y-3">
                                {tier.features.map(feature => <FeatureItem key={feature.text} {...feature} />)}
                           </div>
                           
                           <Separator />
                           
                           <div className='space-y-3'>
                                <h4 className='font-semibold text-amber-400 flex items-center gap-2'>
                                    <Star className='w-5 h-5' />
                                    Exclusive Holder Benefits
                                </h4>
                                {tier.holderBenefits.map(feature => <FeatureItem key={feature.text} {...feature} />)}
                           </div>
                           
                           {canActivateWithShadow ? (
                                <Alert variant='default' className='border-green-500/50 bg-green-500/10 text-green-300'>
                                    <ShieldCheck className="h-5 w-5 text-green-400" />
                                    <AlertTitle>Holder Benefit Unlocked!</AlertTitle>
                                    <AlertDescription>
                                        You have enough SHADOW to activate this tier for free.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/50 animate-pulse-glow [--glow-color:theme(colors.amber.400/0.5)]">
                                    <div className="flex items-center gap-3">
                                        <Hourglass className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '3s' }}/>
                                        <div>
                                            <h5 className="font-semibold text-amber-300">Unlock a Higher Tier</h5>
                                            <p className="text-sm text-amber-400/80">Hold {tier.shadowPrice.toLocaleString()} SHADOW or subscribe with {tier.solPrice} SOL to gain these powerful advantages!</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </CardContent>
                        <CardFooter>
                            <Button 
                                className={cn("w-full h-12 text-lg", canActivateWithShadow && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white")}
                                onClick={() => handleSubscription(tier)} 
                                disabled={buttonDisabled}
                            >
                               {isSubscribing === tier.name ? <Loader className="animate-spin" /> : (activeSubscription === tier.name ? <Check className='mr-2' /> : <Gem className="mr-2" />)} 
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
    

    

    

    