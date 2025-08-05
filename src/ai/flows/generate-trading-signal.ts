'use server';

/**
 * @fileOverview AI-driven trading signal generation flow.
 *
 * - generateTradingSignal - A function that generates trading signals based on market data, indicators, and risk level.
 * - GenerateTradingSignalInput - The input type for the generateTradingSignal function.
 * - GenerateTradingSignalOutput - The return type for the generateTradingSignal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { fetchNews } from '../tools/news-tool';
import { fetchMarketData } from '../tools/market-data-tool';

const GenerateTradingSignalInputSchema = z.object({
  symbol: z.string().describe('The trading symbol (e.g., BTC, ETH).'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The user-selected risk level.'),
});
export type GenerateTradingSignalInput = z.infer<typeof GenerateTradingSignalInputSchema>;

const GenerateTradingSignalOutputSchema = z.object({
  signal: z.enum(['BUY', 'SELL', 'HOLD']).describe('The trading signal (BUY, SELL, or HOLD).'),
  entryZone: z.string().describe('The recommended entry zone for the trade.'),
  stopLoss: z.string().describe('The recommended stop loss level.'),
  takeProfit: z.string().describe('The recommended take profit level.'),
  confidence: z
    .string()
    .describe('The confidence level of the signal (as a percentage).'),
  riskRating: z.enum(['Low', 'Medium', 'High']).describe('The AI-assessed risk rating.'),
  gptConfidenceScore: z
    .string()
    .describe('The AI confidence score (0-100).'),
  sentiment: z.string().describe('A summary of the market sentiment.'),
  disclaimer: z.string().describe('A sarcastic disclaimer.'),
  rsiInterpretation: z.string().describe("Interpretation of the RSI value."),
  emaInterpretation: z.string().describe("Interpretation of the EMA value."),
  vwapInterpretation: z.string().describe("Interpretation of the VWAP value."),
  bollingerBandsInterpretation: z.string().describe("Interpretation of the Bollinger Bands."),
  sarInterpretation: z.string().describe("Interpretation of the Parabolic SAR value."),
  adxInterpretation: z.string().describe("Interpretation of the ADX value."),
});
export type GenerateTradingSignalOutput = z.infer<typeof GenerateTradingSignalOutputSchema>;

export async function generateTradingSignal(
  input: GenerateTradingSignalInput
): Promise<GenerateTradingSignalOutput> {
  return generateTradingSignalFlow(input);
}

const generateTradingSignalPrompt = ai.definePrompt({
  name: 'generateTradingSignalPrompt',
  input: {schema: GenerateTradingSignalInputSchema},
  output: {schema: GenerateTradingSignalOutputSchema},
  tools: [fetchNews, fetchMarketData],
  prompt: `You are an AI trading strategy assistant. Analyze the provided market data, technical indicators, and user risk level to generate a trading signal.

First, use the fetchMarketData tool to get the latest market data for the provided symbol.
Then, use the fetchNews tool to get the latest news about the provided symbol. The query for the news tool should be the full name of the cryptocurrency (e.g. Bitcoin, Ethereum).

User Risk Level: {{riskLevel}}

Based on the live market data and news, provide a trading signal (BUY, SELL, or HOLD), an entry zone, stop loss, take profit, confidence level, AI-assessed risk rating, a sentiment summary, and a sarcastic disclaimer.

For each technical indicator from the market data, provide a detailed interpretation. Explain what the current value means and its potential impact on the price.

- rsiInterpretation: "The RSI is at [RSI_VALUE]. An RSI below 30 suggests the asset may be oversold..."
- emaInterpretation: "The price is trading relative to the [EMA_VALUE] EMA. This can indicate trend direction..."
- vwapInterpretation: "The VWAP is at [VWAP_VALUE]. Trading above the VWAP is bullish..."
- bollingerBandsInterpretation: "The price is near the [BB_VALUE] band. This can signal overbought/oversold conditions..."
- sarInterpretation: "The Parabolic SAR is at [SAR_VALUE]. A value below the price suggests an uptrend..."
- adxInterpretation: "The ADX is at [ADX_VALUE]. A value above 25 indicates a strong trend..."

Consider the user's risk level when determining the trading signal and confidence level. Higher risk tolerance may allow for more aggressive signals.

Output in JSON format.
`,
});

const generateTradingSignalFlow = ai.defineFlow(
  {
    name: 'generateTradingSignalFlow',
    inputSchema: GenerateTradingSignalInputSchema,
    outputSchema: GenerateTradingSignalOutputSchema,
  },
  async input => {
    const {output} = await generateTradingSignalPrompt(input);
    return output!;
  }
);
