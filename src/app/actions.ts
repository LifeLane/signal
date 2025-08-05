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
    if (error instanceof Error && error.message.includes('401')) {
         throw new Error('Unauthorized: Invalid API Key. Please check your CoinMarketCap API key in the .env file.');
    }
     if (error instanceof Error && error.message.includes('400')) {
         throw new Error(`Invalid request for symbol "${symbol}". Please check if the symbol is correct and supported.`);
    }
    throw new Error('Failed to fetch market data. Please try again later.');
  }
}
