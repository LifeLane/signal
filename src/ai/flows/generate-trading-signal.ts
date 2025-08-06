
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
  id: z.string().optional().describe('A unique identifier for this request to prevent caching.'),
  symbol: z.string().describe('The trading symbol (e.g., BTC, ETH).'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The user-selected risk level.'),
});
export type GenerateTradingSignalInput = z.infer<typeof GenerateTradingSignalInputSchema>;

// IMPORTANT: The AI is no longer responsible for price targets.
// It only provides the signal and the reasoning.
const GenerateTradingSignalOutputSchema = z.object({
  id: z.string().describe('A unique identifier for this signal.'),
  symbol: z.string().describe('The trading symbol (e.g., BTC, ETH).'),
  signal: z.enum(['BUY', 'SELL', 'HOLD']).describe('The trading signal (BUY, SELL, or HOLD).'),
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
    prompt: `You are an expert AI trading strategy assistant. Your entire analysis and the final trading signal MUST be based *exclusively* on the data returned by the tools for the specified symbol. Do not use any other data, examples, or prior knowledge. The output 'symbol' MUST match the input 'symbol'.

**Instructions:**
1.  **Fetch Market Data:** Call the \`fetchMarketData\` tool with the user's selected \`symbol\`.
2.  **Fetch News:** From the market data, get the full name of the cryptocurrency (e.g., "Bitcoin" for "BTC"). Call the \`fetchNews\` tool using this full name as the query.
3.  **Analyze News Sentiment:** Based on the headlines from the \`fetchNews\` tool, determine an overall sentiment for the news.
4.  **Analyze Technical Indicators:** Use the data from \`fetchMarketData\` to form a concise, one-sentence interpretation for each technical indicator.
    *   **RSI:** Over 70 is overbought, under 30 is oversold. State the value and its meaning.
    *   **ADX:** Over 25 indicates a strong trend. State the value and its meaning.
    *   **EMA:** If price is above EMA, it's bullish. If below, bearish. State the relationship.
    *   **VWAP:** If price is above VWAP, bullish intraday momentum. If below, bearish. State the relationship.
    *   **Parabolic SAR:** If SAR is below price, it signals an uptrend. If above, a downtrend. State the relationship.
    *   **Bollinger Bands:** Note if the price is near the upper or lower bands, suggesting potential reversals or breakouts.
5.  **Synthesize and Decide Signal:** Combine the news sentiment and all technical indicator analyses to decide on a final trading signal: 'BUY', 'SELL', or 'HOLD'.
6.  **Assess Confidence & Risk:** Provide a 'confidence' percentage and a 'gptConfidenceScore' based on how strongly the data aligns. Provide an AI-assessed 'riskRating'.
7.  **Disclaimer:** Provide this exact disclaimer: "This is not financial advice. All trading involves risk. Past performance is not indicative of future results. Always do your own research."
8.  **Populate Output:** Fill out the entire JSON output, including all interpretations. The output 'symbol' must match the input 'symbol'. The 'id' should be a new unique identifier.

**IMPORTANT: DO NOT calculate 'entryZone', 'stopLoss', or 'takeProfit'. These will be calculated by the system later. Your only job is to provide the signal and the analysis.**

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
