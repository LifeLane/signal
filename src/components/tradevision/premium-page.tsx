
'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Wallet, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import type { Theme } from './tradevision-page';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const subscriptionTiers = [
    {
        name: "Monthly Pro",
        price: "100K SHADOW",
        features: ["Unlimited AI Signals", "Priority Analysis", "All Premium Features"],
        cta: "Go Monthly",
        popular: true,
        hook: "Best for active traders."
    },
    {
        name: "Yearly Elite",
        price: "1 Million SHADOW",
        features: ["12 Months for the Price of 10", "Everything in Monthly Pro", "Exclusive Future Updates"],
        cta: "Go Yearly",
        hook: "Best value & long-term growth."
    },
    {
        name: "Lifetime Access",
        price: "10 Million SHADOW",
        features: ["One-Time Payment, Forever", "Everything in Yearly Elite", "Become a SHADOW OG"],
        cta: "Go Lifetime",
        hook: "For the ultimate conviction."
    },
]

interface PremiumPageProps {
  theme: Theme;
}

export function PremiumPage({ theme }: PremiumPageProps) {
  const { publicKey, connected } = useWallet();
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('SHADOW');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const handleSwap = () => {
    // Placeholder for swap logic
    console.log(`Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`);
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
        
        <Card className={cn(theme === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.blue.500/0.7)]')}>
            <CardHeader>
                <CardTitle>1. Connect Your Wallet</CardTitle>
                <CardDescription>
                    {connected ? "Your wallet is connected." : "Connect your Solana wallet to get started."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {connected ? (
                    <div className="flex items-center justify-center p-3 rounded-lg bg-green-500/20 text-green-400">
                        <Check className="mr-2 h-5 w-5" />
                        <span className='font-semibold'>Wallet Connected</span>
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
            <Card className={cn(theme === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.green.500/0.7)]')}>
                <CardHeader>
                    <CardTitle>2. Get SHADOW Tokens</CardTitle>
                    <CardDescription>Swap SOL for SHADOW to unlock premium access. Powered by Jupiter.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="from-amount">You Pay</Label>
                        <div className="flex gap-2">
                            <Input id="from-amount" type="number" placeholder="0.0" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} />
                            <Button variant="outline" className="min-w-[100px]">{fromToken}</Button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button variant="ghost" size="icon" onClick={() => {
                            setFromToken(toToken);
                            setToToken(fromToken);
                            setFromAmount(toAmount);
                            setToAmount(fromAmount);
                        }}>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="to-amount">You Receive</Label>
                         <div className="flex gap-2">
                            <Input id="to-amount" type="number" placeholder="0.0" value={toAmount} onChange={(e) => setToAmount(e.target.value)} />
                            <Button variant="outline" className="min-w-[100px]">{toToken}</Button>
                        </div>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleSwap} disabled={!connected}>
                        <Zap className="mr-2 h-4 w-4" />
                        Swap Tokens
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

        <div className="grid grid-cols-1 gap-6">
            {subscriptionTiers.map(tier => (
                <Card key={tier.name} className={cn(
                    'flex flex-col',
                    tier.popular && 'border-primary ring-2 ring-primary',
                    theme === 'neural-pulse' && 'animate-pulse-glow [--glow-color:theme(colors.purple.500/0.7)]'
                )}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{tier.name}</span>
                            {tier.popular && <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded-full">POPULAR</span>}
                        </CardTitle>
                        <CardDescription className="text-2xl font-bold">{tier.price}</CardDescription>
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
                        <Button className="w-full" disabled={!connected}>
                           <Gem className="mr-2 h-4 w-4" /> {tier.cta}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>

        <div className="h-12"></div>
    </div>
  );
}
