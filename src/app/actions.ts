
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
import { getMarketData, type MarketData } from '@/services/market-data';

// Define the full output type that the UI expects, including calculated fields.
export type TradingSignalWithTargets = GenerateTradingSignalOutput & {
  entryZone: string;
  stopLoss: string;
  takeProfit: string;
}

const riskLevelPercentages = {
  Low: { stopLoss: 0.02, takeProfit: 0.04 }, // 2% SL, 4% TP
  Medium: { stopLoss: 0.05, takeProfit: 0.08 }, // 5% SL, 8% TP
  High: { stopLoss: 0.1, takeProfit: 0.15 }, // 10% SL, 15% TP
};


export async function getTradingSignalAction(
  input: GenerateTradingSignalInput
): Promise<TradingSignalWithTargets> {
  try {
    // 1. Get the current market data first to have the price for calculations.
    const marketData = await getMarketData(input.symbol);
    const currentPrice = marketData.price;

    // 2. Call the AI to get the signal and analysis (without price targets).
    const aiResult = await generateTradingSignal(input);

    // 3. Calculate price targets based on the AI's signal and real market price.
    let entryZone = "N/A", stopLoss = "N/A", takeProfit = "N/A";
    const riskFactors = riskLevelPercentages[input.riskLevel];

    if (aiResult.signal === 'BUY') {
      entryZone = `${(currentPrice * 0.99).toFixed(2)} - ${(currentPrice * 1.01).toFixed(2)}`;
      stopLoss = (currentPrice * (1 - riskFactors.stopLoss)).toFixed(2);
      takeProfit = (currentPrice * (1 + riskFactors.takeProfit)).toFixed(2);
    } else if (aiResult.signal === 'SELL') {
      entryZone = `${(currentPrice * 0.99).toFixed(2)} - ${(currentPrice * 1.01).toFixed(2)}`;
      stopLoss = (currentPrice * (1 + riskFactors.stopLoss)).toFixed(2);
      takeProfit = (currentPrice * (1 - riskFactors.takeProfit)).toFixed(2);
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
    console.error('Error generating trading signal:', error);
    throw new Error('Failed to generate trading signal. Please try again.');
  }
}

export async function getMarketDataAction(
  symbol: string
): Promise<MarketData> {
  try {
    const result = await getMarketData(symbol);
    return result;
  } catch (error) {
    console.error('Error fetching market data:', error);
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
        console.error('Error generating news summary:', error);
        throw new Error('Failed to generate news summary. Please try again.');
    }
}
