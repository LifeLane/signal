
'use server';

/**
 * @fileOverview AI-driven trading signal generation flow.
 *
 * - generateTradingSignal - A function that generates trading signals based on market data, indicators, and risk level.
 * - GenerateTradingSignalInput - The input type for the generateTradingSignal function.
 * - GenerateTradingSignalOutput - The return type for the generateTradingsignal function.
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
    input: { schema: GenerateTradingSignalInputSchema },
    output: { schema: GenerateTradingSignalOutputSchema },
    tools: [fetchMarketData, fetchNews],
    prompt: `You are an expert AI trading strategy assistant. Your entire analysis and the final trading signal MUST be based *exclusively* on the data returned by the tools for the specified symbol. Do not use any other data, examples, or prior knowledge.

**Instructions:**
1.  **Fetch Market Data:** Call the \`fetchMarketData\` tool with the user's selected \`symbol\`.
2.  **Fetch News:** From the market data, get the full name of the cryptocurrency (e.g., "Bitcoin" for "BTC"). Call the \`fetchNews\` tool using this full name as the query.
3.  **Analyze News Sentiment:** Based on the headlines from the \`fetchNews\` tool, determine an overall sentiment for the news.
4.  **Analyze Technical Indicators:** Use the data from \`fetchMarketData\` to form an interpretation for each technical indicator.
    *   **RSI:** Over 70 is overbought, under 30 is oversold.
    *   **ADX:** Over 25 indicates a strong trend.
    *   **EMA:** If price is above EMA, it's bullish. If below, bearish.
    *   **VWAP:** If price is above VWAP, bullish intraday momentum. If below, bearish.
    *   **Parabolic SAR:** If SAR is below price, uptrend. If above, downtrend.
    *   **Bollinger Bands:** Note if price is near the upper or lower bands.
5.  **Synthesize and Decide Signal:** Combine the news sentiment and all technical indicator analyses to decide on a final trading signal: 'BUY', 'SELL', or 'HOLD'.
6.  **Set Targets:** Calculate 'entryZone', 'stopLoss', and 'takeProfit' levels. These MUST be mathematically relative to the **price** from the \`fetchMarketData\` tool. Adjust the percentage range based on the user's selected \`riskLevel\`:
    *   **Low Risk:** ~1-2% for stop-loss, ~2-4% for take-profit.
    *   **Medium Risk:** ~3-5% for stop-loss, ~5-8% for take-profit.
    *   **High Risk:** ~6-10% for stop-loss, ~10-15% for take-profit.
    *   For 'BUY', Stop Loss must be below Entry, Take Profit above. For 'SELL', the reverse. For 'HOLD', set targets to "N/A".
7.  **Assess Confidence & Risk:** Provide a 'confidence' percentage and a 'gptConfidenceScore' based on how strongly the data aligns. Provide an AI-assessed 'riskRating'.
8.  **Disclaimer:** Provide this exact disclaimer: "This is not financial advice. All trading involves risk. Past performance is not indicative of future results. Always do your own research."
9.  **Populate Output:** Fill out the entire JSON output. The output 'symbol' must match the input 'symbol'.

**Final Output:** Adhere strictly to the JSON format. All generated values MUST be directly derived from the information returned by the tools.
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
