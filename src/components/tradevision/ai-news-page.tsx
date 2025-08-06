
'use client';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getNewsSummaryAction } from '@/app/actions';
import type { GenerateNewsSummaryOutput } from '@/ai/flows/generate-news-summary';
import type { Symbol } from './tradevision-page';
import type { Theme } from '@/app/theme-provider';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SymbolSelector } from './symbol-selector';
import { Bot, Info, Loader, Newspaper, TrendingDown, TrendingUp, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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

interface AiNewsPageProps {
  theme: Theme;
}

export function AiNewsPage({ theme }: AiNewsPageProps) {
  const [isPending, startTransition] = useTransition();
  const [newsSummary, setNewsSummary] = useState<GenerateNewsSummaryOutput | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null);
  const { toast } = useToast();

  const handleAnalyzeNews = () => {
    if (!selectedSymbol) return;
    setNewsSummary(null); // Clear previous summary
    startTransition(async () => {
      try {
        const result = await getNewsSummaryAction({ topic: selectedSymbol });
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
      <Newspaper className="w-16 h-16 text-primary" />
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
        <div className="space-y-4">
            <Card className={cn(
                'shadow-lg transition-all',
                theme.name === 'neural-pulse' && `animate-pulse-glow ${sentimentClasses.glow}`
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
                <CardContent className="space-y-4">
                    {newsSummary.articleSummaries.map((article, index) => (
                        <div key={index} className="border-t pt-4">
                            <h4 className="font-semibold text-foreground">{article.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{article.summary}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 inline-block">
                                Read Full Article
                            </a>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground flex gap-2 items-start">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{newsSummary.disclaimer}</span>
                </CardFooter>
            </Card>
        </div>
    )
  };


  return (
    <div className={cn(
        "flex flex-col h-full",
        (theme.name === 'neural-pulse' || theme.name === 'neon-future') && 'bg-pulse-grid'
      )}>
      <div className="p-4 space-y-4 bg-background">
        <SymbolSelector selectedSymbol={selectedSymbol} onSelectSymbol={setSelectedSymbol} />
        <Button
          size="lg"
          className="w-full"
          onClick={handleAnalyzeNews}
          disabled={isPending || !selectedSymbol}
        >
          {isPending ? <Loader className="animate-spin" /> : 
            <span className='flex items-center gap-2'><Bot /> Analyze News</span>
          }
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {(!selectedSymbol && !isPending && !newsSummary) && renderInitialState()}
        {isPending && renderPendingState()}
        {!isPending && newsSummary && renderNewsSummary()}
      </div>
    </div>
  );
}
