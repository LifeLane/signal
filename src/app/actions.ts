
'use server';

import {
  generateTradingSignal,
  type GenerateTradingSignalInput,
  type GenerateTradingSignalOutput,
} from '@/ai/flows/generate-trading-signal';
import { 
    generateNewsSummary, 
    type GenerateNewsSummaryInput, 
    type GenerateNewsSummaryOutput 
} from '@/ai/flows/generate-news-summary';
import { getMarketData, type MarketData, searchCoins, type SearchResult, getTopCoins, getShadowTokenDetails, type ShadowTokenDetails } from '@/services/market-data';

// Define the full output type that the UI expects, including calculated fields.
export type TradingSignalWithTargets = GenerateTradingSignalOutput & {
  entryZone: string;
  stopLoss: string;
  takeProfit: string;
}

const riskLevelStopLossFactor = {
  Low: 1.5, // Wider stop loss for lower risk
  Medium: 1.0,
  High: 0.75, // Tighter stop loss for higher risk
};

const riskLevelTakeProfitFactor = {
    Low: 1.5, // Modest take profit
    Medium: 2.0,
    High: 2.5, // Ambitious take profit
}


export async function getTradingSignalAction(
  input: GenerateTradingSignalInput
): Promise<TradingSignalWithTargets> {
  try {
    // 1. Get the current market data first to have the price for calculations.
    const marketData = await getMarketData(input.symbol);
    const currentPrice = marketData.price;

    // 2. Call the AI to get the signal and analysis (without price targets).
    const aiResult = await generateTradingSignal(input);

    // 3. Calculate price targets based on the AI's signal and real market data.
    let entryZone = "N/A", stopLoss = "N/A", takeProfit = "N/A";
    
    // Use a small buffer to create a more realistic zone
    const entryBuffer = currentPrice * 0.005; // 0.5% buffer
    entryZone = `${(currentPrice - entryBuffer).toFixed(2)} - ${(currentPrice + entryBuffer).toFixed(2)}`;

    // Calculate Stop-Loss and Take-Profit based on Support/Resistance
    if (aiResult.signal === 'BUY') {
        const stopLossDistance = (currentPrice - marketData.support) * riskLevelStopLossFactor[input.riskLevel];
        const takeProfitDistance = (marketData.resistance - currentPrice) * riskLevelTakeProfitFactor[input.riskLevel];
        
        stopLoss = (currentPrice - stopLossDistance).toFixed(2);
        takeProfit = (currentPrice + takeProfitDistance).toFixed(2);

    } else if (aiResult.signal === 'SELL') {
        const stopLossDistance = (marketData.resistance - currentPrice) * riskLevelStopLossFactor[input.riskLevel];
        const takeProfitDistance = (currentPrice - marketData.support) * riskLevelTakeProfitFactor[input.riskLevel];

        stopLoss = (currentPrice + stopLossDistance).toFixed(2);
        takeProfit = (currentPrice - takeProfitDistance).toFixed(2);
    }

    // 4. Combine the AI result with the calculated targets.
    const finalResult: TradingSignalWithTargets = {
      ...aiResult,
      entryZone,
      stopLoss,
      takeProfit,
    };

    return finalResult;
  } catch (error) {
    console.error('Error in getTradingSignalAction:', error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while generating the trading signal.');
  }
}

export async function getMarketDataAction(
  symbol: string
): Promise<MarketData> {
  try {
    const result = await getMarketData(symbol);
    return result;
  } catch (error) {
    console.error(`Error in getMarketDataAction for symbol ${symbol}:`, error);
    // This is a user-facing error, so make it helpful.
    if (error instanceof Error) {
        // Pass the specific error message from the service layer
        throw new Error(error.message);
    }
    // Generic fallback
    throw new Error('An unexpected error occurred while fetching market data.');
  }
}

export async function getNewsSummaryAction(
  input: GenerateNewsSummaryInput
): Promise<GenerateNewsSummaryOutput> {
    try {
        const result = await generateNewsSummary(input);
        return result;
    } catch (error) {
        console.error('Error in getNewsSummaryAction:', error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred while generating the news summary.');
    }
}

export async function searchSymbolsAction(query: string): Promise<SearchResult[]> {
    try {
        if (!query) return [];
        const results = await searchCoins(query);
        return results;
    } catch (error) {
        console.error('Error in searchSymbolsAction:', error);
        // Return empty array on error to prevent crashing the client, but log it.
        return [];
    }
}

export async function getTopCoinsAction(): Promise<SearchResult[]> {
    try {
        const results = await getTopCoins();
        return results;
    } catch (error) {
        console.error('Error in getTopCoinsAction:', error);
        return [];
    }
}

export async function getShadowDetailsAction(): Promise<ShadowTokenDetails> {
    try {
        const result = await getShadowTokenDetails();
        return result;
    } catch (error) {
        console.error('Error in getShadowDetailsAction:', error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred while fetching SHADOW token details.');
    }
}
