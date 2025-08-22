
'use client';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { getNewsSummaryAction } from '@/app/actions';
import type { GenerateNewsSummaryOutput } from '@/ai/flows/generate-news-summary';
import type { Symbol } from './tradevision-page';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Info, Loader, Newspaper, TrendingDown, TrendingUp, MinusCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { IntroLogo } from './intro-logo';

const getSentimentClass = (sentiment?: 'Positive' | 'Negative' | 'Neutral') => {
  switch (sentiment) {
    case 'Positive':
      return {
        icon: TrendingUp,
        text: 'text-green-400',
        bg: 'bg-green-500/20',
        border: 'border-green-400/50',
        glow: '[--glow-color:theme(colors.green.400)]',
      };
    case 'Negative':
      return {
        icon: TrendingDown,
        text: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-400/50',
        glow: '[--glow-color:theme(colors.red.400)]',
      };
    default:
      return {
        icon: MinusCircle,
        text: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-amber-400/50',
        glow: '[--glow-color:theme(colors.amber.400)]',
      };
  }
};

const popularSymbols: { name: string; symbol: string }[] = [
    { name: 'Bitcoin', symbol: 'BTC' },
    { name: 'Ethereum', symbol: 'ETH' },
    { name: 'Solana', symbol: 'SOL' },
    { name: 'Cardano', symbol: 'ADA'},
    { name: 'Toncoin', symbol: 'TON'},
    { name: 'Raydium', symbol: 'RAY'},
];


export function AiNewsPage() {
  const [isPending, startTransition] = useTransition();
  const [newsSummary, setNewsSummary] = useState<GenerateNewsSummaryOutput | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null);
  const { toast } = useToast();

  const handleAnalyzeNews = (symbol: Symbol) => {
    setSelectedSymbol(symbol);
    setNewsSummary(null); // Clear previous summary
    startTransition(async () => {
      try {
        const result = await getNewsSummaryAction({ topic: symbol });
        setNewsSummary(result);
      } catch (e: any) {
        toast({
          variant: 'destructive',
          title: 'Error Analyzing News',
          description: e.message,
        });
      }
    });
  };

  const sentimentClasses = getSentimentClass(newsSummary?.overallSentiment);
  const SentimentIcon = sentimentClasses.icon;


  const renderInitialState = () => (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full space-y-4">
      <div className="border border-primary/20 rounded-xl p-4 w-full max-w-sm mx-auto animate-pulse-glow [--glow-color:theme(colors.primary/0.3)]">
        <IntroLogo />
      </div>
      <h2 className="text-2xl font-bold">AI News Analysis</h2>
      <p className="text-muted-foreground">
        Select a cryptocurrency to get an AI-powered summary and sentiment analysis of the latest news.
      </p>
    </div>
  );

  const renderPendingState = () => (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full space-y-4">
        <div className='flex items-center gap-2 text-primary text-xl font-semibold'>
            <Bot className="w-8 h-8 animate-pulse" />
            <span>Analyzing Headlines...</span>
        </div>
      <p className="text-muted-foreground">
        Our AI is reading and summarizing the latest news for {selectedSymbol}. Please wait a moment.
      </p>
    </div>
  );
  
  const renderNewsSummary = () => {
    if (!newsSummary) return null;
    
    return (
        <div className="space-y-6">
            <Card className={cn(
                'shadow-lg transition-all animate-pulse-glow',
                sentimentClasses.glow
            )}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <SentimentIcon className={cn("w-6 h-6", sentimentClasses.text)} />
                           <span>Overall Sentiment</span>
                        </div>
                        <Badge
                            className={cn('text-base', sentimentClasses.text, sentimentClasses.bg)}
                            variant="secondary"
                        >
                            {newsSummary.overallSentiment}
                        </Badge>
                    </CardTitle>
                    <CardDescription>{newsSummary.sentimentReasoning}</CardDescription>
                </CardHeader>
            </Card>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">News Breakdown</h3>
                {newsSummary.articleSummaries.map((article, index) => (
                    <Card key={index} className='overflow-hidden'>
                        <CardContent className="p-4 flex gap-4 items-start">
                            <div className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden">
                                <Image
                                    src={article.imageUrl || `https://placehold.co/400x400.png`}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    data-ai-hint="news article"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-foreground hover:underline">
                                    {article.title}
                                </a>
                                {article.summary && <p className="text-sm text-muted-foreground">{article.summary}</p>}
                                <Button asChild variant="link" size="sm" className='p-0 h-auto'>
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        Read Full Article <ExternalLink className='ml-1.5' />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="mt-6">
                <CardFooter className="text-xs text-muted-foreground flex gap-2 items-start p-4">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{newsSummary.disclaimer}</span>
                </CardFooter>
            </Card>
        </div>
    )
  };


  return (
    <div className="flex flex-col bg-pulse-grid flex-1 overflow-hidden">
      <div className="p-4 space-y-4 bg-background z-10 border-b border-border">
         <div className="grid grid-cols-3 gap-4">
            {popularSymbols.map(({ name, symbol }) => (
                <Button 
                    key={name} 
                    variant={selectedSymbol === name ? "default" : "outline"}
                    onClick={() => handleAnalyzeNews(name)}
                    disabled={isPending}
                    className='flex flex-col h-auto py-3 animate-multi-color-glow'
                >
                    <span className='font-bold text-lg'>{symbol}</span>
                    <span className='text-xs text-muted-foreground'>{name}</span>
                </Button>
            ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {(!selectedSymbol && !isPending && !newsSummary) && renderInitialState()}
        {isPending && renderPendingState()}
        {!isPending && newsSummary && renderNewsSummary()}
      </div>
    </div>
  );
}
