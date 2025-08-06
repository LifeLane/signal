
'use server';

/**
 * @fileOverview AI-driven trading signal generation flow.
 *
 * - generateTradingSignal - A function that generates trading signals based on market data, indicators, and risk level.
 * - GenerateTradingSignalInput - The input type for the generateTradingSignal function.
 * - GenerateTradingSignalOutput - The return type for the generateTradingSignal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
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
  id: z.string().describe('A unique identifier for this signal.'),
  symbol: z.string().describe('The trading symbol (e.g., BTC, ETH).'),
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
  sentiment: z.string().describe('A summary of the market sentiment based on news.'),
  disclaimer: z.string().describe('A standard financial disclaimer.'),
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
  prompt: `You are an expert AI trading strategy assistant. Your task is to analyze market data, technical indicators, and news to generate a coherent and actionable trading signal for the given cryptocurrency symbol.

**Instructions:**
1.  **Fetch Market Data:** First, call the \`fetchMarketData\` tool using the provided \`symbol\`. This is your primary source of quantitative data.
2.  **Fetch News:** Then, call the \`fetchNews\` tool. To get the query for the news tool, you MUST map the provided symbol to its full name. Use the following mapping:
    - BTC -> Bitcoin
    - ETH -> Ethereum
    - SOL -> Solana
    - XRP -> Ripple
    - DOGE -> Dogecoin
    For example, if the input symbol is 'BTC', the news query must be 'Bitcoin'. This is your primary source for market sentiment.
3.  **Analyze and Strategize:** Your entire analysis and the final trading signal must be based *exclusively* on the data returned by these tools for the specified symbol. Do not use any other data, examples, or prior knowledge. Your analysis must directly correlate to the provided data.
4.  **User Risk Level:** The user's selected risk level is: {{riskLevel}}. Adjust your Entry, Stop, and Profit targets accordingly. Higher risk means wider targets, lower risk means tighter targets.

**Strategy Logic:**
-   Base your strategy on a holistic analysis of the technical indicators from the market data and the sentiment from the news.
-   For a 'BUY' signal, the Stop Loss must be below the Entry Zone, and the Take Profit must be above it.
-   For a 'SELL' signal, the Stop Loss must be above the Entry Zone, and the Take Profit must be below it.
-   For a 'HOLD' signal, provide a relevant price range to watch. Set entry, stop, and profit to "N/A".

**Indicator Interpretation:**
For each technical indicator provided by the \`fetchMarketData\` tool, you MUST provide a detailed, one-sentence interpretation of its specific value in the context of the current market.
-   **rsiInterpretation**: Based on the RSI value of [RSI_VALUE], interpret whether the asset is overbought, oversold, or neutral.
-   **emaInterpretation**: Based on the price relative to the EMA of [EMA_VALUE], interpret the current trend direction.
-   **vwapInterpretation**: Based on the price relative to the VWAP of [VWAP_VALUE], interpret the current intraday momentum.
-   **bollingerBandsInterpretation**: Based on the price's position relative to the Bollinger Bands ([BB_LOWER] - [BB_UPPER]), interpret the current volatility and potential for mean reversion or breakout.
-   **sarInterpretation**: Based on the Parabolic SAR value of [SAR_VALUE] relative to the price, interpret the potential trend direction and reversal points.
-   **adxInterpretation**: Based on the ADX value of [ADX_VALUE], interpret the strength of the current trend (strong or weak).

**Disclaimer:**
Provide this exact disclaimer: "This is not financial advice. All trading involves risk. Past performance is not indicative of future results. Always do your own research."

**Final Output:**
Adhere strictly to the output JSON format. Ensure all generated values and interpretations are directly derived from the tool outputs for the correct symbol. The output 'symbol' field must match the input 'symbol' field.
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
