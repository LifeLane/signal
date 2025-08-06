'use server';

/**
 * @fileOverview A tool for fetching live market data.
 *
 * - fetchMarketData - A Genkit tool that retrieves market data for a given symbol.
 */

import {ai} from '@/ai/genkit';
import {getMarketData} from '@/services/market-data';
import {z} from 'zod';

export const fetchMarketData = ai.defineTool(
  {
    name: 'fetchMarketData',
    description:
      'Fetches live market data for a given cryptocurrency symbol. Includes price, volume, market cap, and key technical indicators.',
    inputSchema: z.object({
      symbol: z.string().describe('The cryptocurrency symbol (e.g., BTC, ETH).'),
    }),
    outputSchema: z.object({
        name: z.string().describe('The full name of the cryptocurrency (e.g., Bitcoin).'),
        price: z.number(),
        change: z.number(),
        volume24h: z.number(),
        marketCap: z.number(),
        longShortRatio: z.number(),
        rsi: z.number(),
        ema: z.number(),
        vwap: z.number(),
        bollingerBands: z.object({ upper: z.number(), lower: z.number() }),
        sar: z.number(),
        adx: z.number(),
    }),
  },
  async input => {
    console.log(`Fetching market data for symbol: ${input.symbol}`);
    return await getMarketData(input.symbol);
  }
);
