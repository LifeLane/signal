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
1.  **Fetch Market Data:** First, call the \`fetchMarketData\` tool using the provided \`symbol\`.
2.  **Fetch News:** Then, call the \`fetchNews\` tool. The query for the news tool should be the full name of the cryptocurrency (e.g., for 'BTC', use 'Bitcoin'; for 'ETH', use 'Ethereum').
3.  **Analyze and Strategize:** Analyze the *entire output* from both tools. Your entire analysis and the final trading signal must be based *exclusively* on the data returned by these tools for the specified symbol. Do not use any other data or examples.
4.  **User Risk Level:** The user's selected risk level is: {{riskLevel}}.

**Strategy Logic:**
-   Base your strategy on the technical indicators from the market data and the sentiment from the news.
-   For a 'BUY' signal, the Stop Loss must be below the Entry Zone, and the Take Profit must be above it.
-   For a 'SELL' signal, the Stop Loss must be above the Entry Zone, and the Take Profit must be below it.
-   For a 'HOLD' signal, provide a wider range or relevant levels to watch, but do not provide specific entry/stop/profit points.

**Indicator Interpretation:**
Provide a detailed interpretation for each technical indicator from the market data. Explain what the current value means and its potential impact on the price.
-   rsiInterpretation: "The RSI is at [RSI_VALUE]. An RSI below 30 suggests the asset may be oversold..."
-   emaInterpretation: "The price is trading relative to the [EMA_VALUE] EMA. This can indicate trend direction..."
-   vwapInterpretation: "The VWAP is at [VWAP_VALUE]. Trading above the VWAP is bullish..."
-   bollingerBandsInterpretation: "The price is near the [BB_VALUE] band. This can signal overbought/oversold conditions..."
-   sarInterpretation: "The Parabolic SAR is at [SAR_VALUE]. A value below the price suggests an uptrend..."
-   adxInterpretation: "The ADX is at [ADX_VALUE]. A value above 25 indicates a strong trend..."

**Disclaimer:**
Provide a standard, serious financial disclaimer. Example: "This is not financial advice. All trading involves risk. Past performance is not indicative of future results."

**Final Output:**
Adhere strictly to the output JSON format. Ensure the generated values are directly derived from the tool outputs for the correct symbol.
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
