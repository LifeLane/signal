
'use server';

import {
  generateTradingSignal,
  type GenerateTradingSignalInput,
  type GenerateTradingSignalOutput,
} from '@/ai/flows/generate-trading-signal';
import { getMarketData, type MarketData } from '@/services/market-data';

export async function getTradingSignalAction(
  input: GenerateTradingSignalInput
): Promise<GenerateTradingSignalOutput> {
  try {
    const result = await generateTradingSignal(input);
    return result;
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
