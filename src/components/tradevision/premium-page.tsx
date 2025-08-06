
'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gem, Wallet, ArrowRight } from 'lucide-react';
import type { Theme } from './tradevision-page';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const subscriptionTiers = [
    {
        name: "Trial",
        price: "10K SHADOW",
        features: ["3 Day Trial"],
        cta: "Start Trial"
    },
    {
        name: "Monthly",
        price: "100K SHADOW",
        features: ["1 Month Unlimited Access"],
        cta: "Go Monthly",
        popular: true
    },
    {
        name: "Yearly",
        price: "1 Million SHADOW",
        features: ["1 Year Unlimited Access"],
        cta: "Go Yearly"
    },
    {
        name: "Lifetime",
        price: "10 Million SHADOW",
        features: ["Lifetime Access"],
        cta: "Go Lifetime"
    }
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
            <h1 className="text-3xl font-bold text-foreground">Unlock Your Potential</h1>
            <p className="text-muted-foreground mt-2">Choose a plan that fits your trading style and goals.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
            {subscriptionTiers.map(tier => (
                <Card key={tier.name} className={cn('flex flex-col', tier.popular && 'border-primary ring-2 ring-primary')}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{tier.name}</span>
                            {tier.popular && <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded-full">POPULAR</span>}
                        </CardTitle>
                        <CardDescription className="text-2xl font-bold">{tier.price}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3">
                        {tier.features.map(feature => (
                            <div key={feature} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
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
        
        <Card>
            <CardHeader>
                <CardTitle>Solana Wallet</CardTitle>
                <CardDescription>Connect your wallet to subscribe and swap tokens.</CardDescription>
            </CardHeader>
            <CardContent>
                <WalletMultiButton style={{width: '100%',
                    backgroundColor: 'hsl(var(--primary))',
                    display: 'flex',
                    justifyContent: 'center',
                    height: '44px',
                    fontSize: '1rem',
                }}/>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Swap Tokens</CardTitle>
                <CardDescription>Powered by Jupiter</CardDescription>
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
                <Button className="w-full" size="lg" onClick={handleSwap} disabled={!connected}>Swap</Button>
            </CardContent>
        </Card>

        <div className="h-12"></div>
    </div>
  );
}
