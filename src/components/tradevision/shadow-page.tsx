
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, TrendingUp, TrendingDown, RefreshCw, Loader, Coins, Scale, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { IntroLogo } from './intro-logo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ThemeSwitcher } from './theme-switcher';
import { getShadowDetailsAction } from '@/app/actions';
import { useEffect, useState, useTransition } from 'react';
import type { ShadowTokenDetails } from '@/services/market-data';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { GeckoTerminalChart } from './gecko-terminal-chart';


const contractDetails = {
    name: "SHADOW (SHADOW)",
    decimals: 6,
    mintAuth: "Revoked",
    freezeAuth: "Revoked",
    updateAuth: "Revoked",
    creator: "38XnV4BZownmFeFrykAYhfMJvWxaZ31t4zBa96HqChEe",
    firstMint: "July 15, 2025 15:12:33 +UTC",
    extensions: "False",
    address: "B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR",
};

const explorerLinks = [
    { name: "Token Explorer", url: "https://solscan.io/token/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR" },
    { name: "Transactions", url: "https://solscan.io/token/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR#transactions" },
    { name: "DeFi Activities", url: "https://solscan.io/token/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR#defiactivities" },
    { name: "Holder View", url: "https://solscan.io/token/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR#holders" },
    { name: "Token Analytics", url: "https://solscan.io/token/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR#analytics" },
    { name: "Pool and Markets", url: "https://solscan.io/token/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR#markets" },
    { name: "Token Metadata", url: "https://solscan.io/token/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR#metadata" },
];

const tradingLinks = [
    { name: "BirdEye", url: "https://birdeye.so/token/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR?chain=solana" },
    { name: "GeckoTerminal", url: "https://www.geckoterminal.com/solana/tokens/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR" },
    { name: "GMGN", url: "https://gmgn.ai/sol/token/solscan_B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR" },
    { name: "DexScreener", url: "https://dexscreener.com/solana/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR" },
    { name: "DexTools", url: "https://www.dextools.io/app/en/solana/pair-explorer/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR" },
    { name: "Photon", url: "https://photon-sol.tinyastro.io/en/r/solscanofficial/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR" },
    { name: "RugCheck", url: "https://rugcheck.xyz/tokens/B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR" },
];

const jupiterLockerData = [
  { account: "Jupiter Locker", amount: "1B", ratio: "10.00%", link: "https://solscan.io/account/BUuvTwwdjugFjuiBq2bwqxPQhAnLDF5S8mVMzPg7UWSW" },
  { account: "Jupiter Locker", amount: "1B", ratio: "10.00%", link: "https://solscan.io/account/84c6ox6diCx1246ZLk6DQX2dvs7RNofsuAQq7jcztMzK" },
  { account: "Jupiter Locker", amount: "1B", ratio: "10.00%", link: "https://solscan.io/account/EcapQWX8P9M7uLtLkYt89SPFmA1GCSrZTdr7M48zVSG3" },
  { account: "Jupiter Locker", amount: "1B", ratio: "10.00%", link: "https://solscan.io/account/B4RzXtzrpkJ5VgaEPrwPp2hQiYCZb9YtzF2khHQU2c8w" },
  { account: "Jupiter Locker", amount: "900M", ratio: "9.00%", link: "https://solscan.io/account/FRFW5VNevgATBzX9yNUBZcGoPa9A2YxbvDCiZJR66cb6" },
  { account: "Jupiter Locker", amount: "750M", ratio: "7.50%", link: "https://solscan.io/account/6K5Z1ZVwLGdqiF8JcTUPDBSU7fUg4hg1MS5cmPiFHmgW" },
  { account: "Jupiter Locker", amount: "750M", ratio: "7.50%", link: "https://solscan.io/account/HT4K5HH8MmG2DD89kB5D9snyGBRUYhYByWf6qR4LvcZE" },
  { account: "Jupiter Locker", amount: "500M", ratio: "5.00%", link: "https://solscan.io/account/AwtpV9xB43eZ9FLFfU1SotB8SaPxdy478pvJZ5FnxLQ2" },
  { account: "Jupiter Locker", amount: "500M", ratio: "5.00%", link: "https://solscan.io/account/Bqswcxct2H1W51AVYedCMUUxF4kcZApDZwN2JEhX2r7r" },
  { account: "Jupiter Locker", amount: "500M", ratio: "5.00%", link: "https://solscan.io/account/6LUYctYcNTfp1HUMqcw5L3vLuG5Gdti1SWkemPH85En1" },
  { account: "Jupiter Locker", amount: "400M", ratio: "4.00%", link: "https://solscan.io/account/AMpoZ7n4rQNh5gGHwCehVhRtHNgU3YRRPqaZL6jvKtcM" },
  { account: "Jupiter Locker", amount: "400M", ratio: "4.00%", link: "https://solscan.io/account/8bh5SsWtM7BU11n2vwJetm59o4M2Dd3W5e8hC3GmXeoA" },
  { account: "Jupiter Locker", amount: "400M", ratio: "4.00%", link: "https://solscan.io/account/44dxXdzEpFMXqpQ9BHhDAzxCt6AY2XWuWAw24WNSSd8h" },
  { account: "Jupiter Locker", amount: "300M", ratio: "3.00%", link: "https://solscan.io/account/DeMJiqbaxNn71SP6ZgCbDuFtxmF1fLWgAt9RzPoSCpA8" },
  { account: "Jupiter Locker", amount: "150M", ratio: "1.50%", link: "https://solscan.io/account/EJ5gs2NxKS1ACxXh9NCXqVdLGifrvGQzchGiYkL2Kr9C" },
  { account: "Jupiter Locker", amount: "100M", ratio: "1.00%", link: "https://solscan.io/account/4ePV3ZkQGK8qBPjGkcBPMCqmfoc9AR6miSJgqP42qF1L" },
  { account: "Jupiter Locker", amount: "75M", ratio: "0.75%", link: "https://solscan.io/account/7axcsHsmfTR7mLPXcWryV6fosxyETi2BCVHKB2gAuFvp" },
  { account: "Jupiter Locker", amount: "75M", ratio: "0.75%", link: "https://solscan.io/account/HBxvs95QQ65EhDxXDJBd8RfzxpQJamwEx5Wnr4H5N2K9" },
  { account: "Jupiter Locker", amount: "50M", ratio: "0.50%", link: "https://solscan.io/account/7d5qWRFwAjVgQb1tPBuFNZvW1CM3BG1yVVDsbg4u4mxj" },
  { account: "Jupiter Locker", amount: "50M", ratio: "0.50%", link: "https://solscan.io/account/BeqL8z1jVwkg7xrT1ZQYCzt9XgAiy2fz7f88CjUFcTxy" },
];

const jupiterConfigs = {
    requests: "Up to 10 requests/sec",
    latency: "80ms Latency or faster",
    location: "Ashburn, Virginia (US East region)",
    version: "v6.0.53",
    swapApi: "Swap API for pump.fun",
    publicApi: "https://public.jupiterapi.com",
    swapApiV1: "https://api.jup.ag/swap/v1",
}

const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    if (num === 0) return '0';
    if (num < 0.000001) {
        return num.toExponential(2);
    }
    if (num < 1) {
        return num.toFixed(6);
    }
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    return num.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        ...options
    });
};

const DetailRow = ({ label, value, canCopy = false }: { label: string; value: string; canCopy?: boolean }) => {
    const { toast } = useToast();
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        toast({ title: 'Copied to clipboard!', description: value });
    };

    return (
        <div className="flex justify-between items-center text-sm py-2">
            <span className="text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <span className="font-semibold text-right break-all">{value}</span>
                {canCopy && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};

const TokenDetailCard = ({ details, isLoading, onRefresh }: { details: ShadowTokenDetails | null, isLoading: boolean, onRefresh: () => void }) => {
    if (isLoading && !details) {
        return (
            <Card className="bg-card animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-1'><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-24" /></div>
                        <div className='space-y-1'><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-24" /></div>
                    </div>
                    <div className='space-y-1'><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-full" /></div>
                </CardContent>
            </Card>
        );
    }

    if (!details) return null;

    const isPriceUp = details.priceChange24h >= 0;

    return (
        <Card className="bg-card animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className="flex items-center gap-2">
                        <Coins className='h-6 w-6 text-primary' />
                        <span>{details.name} ({details.symbol})</span>
                    </CardTitle>
                    <Button variant='ghost' size='icon' onClick={onRefresh} disabled={isLoading}>
                        {isLoading ? <Loader className='h-4 w-4 animate-spin' /> : <RefreshCw className='h-4 w-4'/>}
                    </Button>
                </div>
                <CardDescription>Live token data from BirdEye</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">Price</span>
                        <span className="text-lg font-bold text-foreground">${formatNumber(details.price)}</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground">24h Change</span>
                        <span className={cn("text-lg font-bold flex items-center", isPriceUp ? 'text-green-400' : 'text-red-400')}>
                            {isPriceUp ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                            {details.priceChange24h.toFixed(2)}%
                        </span>
                    </div>
                 </div>
                 <div className="flex flex-col col-span-2 gap-1 p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className="text-lg font-bold text-foreground">${formatNumber(details.marketCap)}</span>
                </div>
            </CardContent>
        </Card>
    )
}

export function ShadowPage() {
    const { toast } = useToast();
    const [details, setDetails] = useState<ShadowTokenDetails | null>(null);
    const [isPending, startTransition] = useTransition();

    const fetchDetails = () => {
        startTransition(async () => {
            try {
                const result = await getShadowDetailsAction();
                setDetails(result);
            } catch (e: any) {
                toast({
                    variant: 'destructive',
                    title: 'Error Fetching Token Details',
                    description: e.message,
                });
            }
        });
    }

    useEffect(() => {
        fetchDetails();
    }, []);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-pulse-grid">
            
            <TokenDetailCard details={details} isLoading={isPending} onRefresh={fetchDetails} />
            
            <GeckoTerminalChart />
            
            <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="border border-primary/20 rounded-xl p-2 animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
                    <AccordionTrigger className='text-lg font-semibold'>Smart Contract Details</AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
                            <DetailRow label="Token Name" value={contractDetails.name} />
                            <Separator />
                            <DetailRow label="Token Address" value={contractDetails.address} canCopy />
                            <Separator />
                            <DetailRow label="Creator" value={contractDetails.creator} canCopy />
                            <Separator />
                            <DetailRow label="Decimals" value={contractDetails.decimals.toString()} />
                            <Separator />
                            <DetailRow label="First Mint" value={contractDetails.firstMint} />
                            <Separator />
                            <DetailRow label="Mint Authority" value={contractDetails.mintAuth} />
                            <Separator />
                            <DetailRow label="Freeze Authority" value={contractDetails.freezeAuth} />
                            <Separator />
                            <DetailRow label="Update Authority" value={contractDetails.updateAuth} />
                            <Separator />
                            <DetailRow label="Token Extensions" value={contractDetails.extensions} />
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-primary/20 rounded-xl p-2 animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
                    <AccordionTrigger className='text-lg font-semibold'>Solana Explorer Links</AccordionTrigger>
                    <AccordionContent>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {explorerLinks.map(link => (
                                <Button asChild key={link.name} variant="outline" className="justify-start gap-2">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                        {link.name}
                                    </a>
                                </Button>
                            ))}
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border border-primary/20 rounded-xl p-2 animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
                    <AccordionTrigger className='text-lg font-semibold'>Token Trading Links</AccordionTrigger>
                    <AccordionContent>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {tradingLinks.map(link => (
                                <Button asChild key={link.name} variant="outline" className="justify-start gap-2">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                        {link.name}
                                    </a>
                                </Button>
                            ))}
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border border-primary/20 rounded-xl p-2 animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
                    <AccordionTrigger className='text-lg font-semibold'>Jupiter Locker Token Lock</AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Account</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Ratio</TableHead>
                                            <TableHead>Link</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {jupiterLockerData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.account}</TableCell>
                                                <TableCell>{item.amount}</TableCell>
                                                <TableCell>{item.ratio}</TableCell>
                                                <TableCell>
                                                    <Button asChild variant="ghost" size="icon">
                                                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border border-primary/20 rounded-xl p-2 animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
                    <AccordionTrigger className='text-lg font-semibold'>Jupiter Configurations</AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
                            <DetailRow label="Requests" value={jupiterConfigs.requests} />
                            <Separator />
                            <DetailRow label="Latency" value={jupiterConfigs.latency} />
                            <Separator />
                            <DetailRow label="Location" value={jupiterConfigs.location} />
                            <Separator />
                            <DetailRow label="Version" value={jupiterConfigs.version} />
                            <Separator />
                            <DetailRow label="Swap API" value={jupiterConfigs.swapApi} />
                            <Separator />
                            <DetailRow label="Public API" value={jupiterConfigs.publicApi} canCopy />
                            <Separator />
                            <DetailRow label="Swap API v1" value={jupiterConfigs.swapApiV1} canCopy />
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="item-6" className="border border-primary/20 rounded-xl p-2 animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
                    <AccordionTrigger className='text-lg font-semibold'>Theme Settings</AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
                           <ThemeSwitcher />
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7" className="border border-primary/20 rounded-xl p-2 animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
                    <AccordionTrigger className='text-lg font-semibold'>About</AccordionTrigger>
                    <AccordionContent>
                       <CardContent className="space-y-4">
                            <div className="border border-primary/20 rounded-xl p-4 w-full max-w-sm mx-auto animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
                                <IntroLogo />
                            </div>
                            <p className="text-muted-foreground mt-2 text-lg text-center">Your Unfair Advantage in the Crypto Markets.</p>
                       </CardContent>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
            <div className="h-12"></div>
        </div>
    );
}
