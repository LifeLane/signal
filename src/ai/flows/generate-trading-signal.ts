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

const GenerateTradingSignalInputSchema = z.object({
  symbol: z.string().describe('The trading symbol (e.g., BTCUSDT).'),
  interval: z.string().describe('The time interval (e.g., 1m, 15m, 1h, 4h).'),
  price: z.number().describe('The current price of the symbol.'),
  volume24h: z.number().describe('The 24-hour trading volume.'),
  marketCap: z.number().describe('The market capitalization of the symbol.'),
  sentiment: z.string().describe('The current market sentiment (e.g., Bullish, Bearish).'),
  rsi: z.number().describe('The Relative Strength Index value.'),
  ema: z.number().describe('The Exponential Moving Average value.'),
  vwap: z.number().describe('The Volume Weighted Average Price value.'),
  bollingerBands: z
    .object({
      upper: z.number(),
      lower: z.number(),
    })
    .describe('Bollinger Bands values.'),
  sar: z.number().describe('The Parabolic SAR value.'),
  adx: z.number().describe('The Average Directional Index value.'),
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
  prompt: `You are an AI trading strategy assistant. Analyze the provided market data, technical indicators, and user risk level to generate a trading signal.

Market Data:
- Symbol: {{symbol}}
- Interval: {{interval}}
- Price: {{price}}
- 24h Volume: {{volume24h}}
- Market Cap: {{marketCap}}
- Sentiment: {{sentiment}}

Technical Indicators:
- RSI: {{rsi}}
- EMA: {{ema}}
- VWAP: {{vwap}}
- Bollinger Bands Upper: {{bollingerBands.upper}}
- Bollinger Bands Lower: {{bollingerBands.lower}}
- SAR: {{sar}}
- ADX: {{adx}}

User Risk Level: {{riskLevel}}

Based on this information, provide a trading signal (BUY, SELL, or HOLD), an entry zone, stop loss, take profit, confidence level, AI-assessed risk rating, a sentiment summary, and a sarcastic disclaimer.

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
