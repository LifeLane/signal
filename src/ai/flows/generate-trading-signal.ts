
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
import { getMarketData, MarketData } from '@/services/market-data';

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
    input: {
        schema: z.object({
            symbol: z.string(),
            riskLevel: z.string(),
            marketData: z.any(), // Using any() because the MarketData type is complex for the prompt schema
            newsSentiment: z.string(),
            newsReasoning: z.string(),
        }),
    },
    output: { schema: GenerateTradingSignalOutputSchema },
    prompt: `You are an expert AI trading strategy assistant. Your task is to analyze pre-processed market data, technical indicator interpretations, and news sentiment to generate a coherent and actionable trading signal for the given cryptocurrency symbol: {{{symbol}}}.

Your entire analysis and the final trading signal MUST be based *exclusively* on the data provided below. Do not use any other data, examples, or prior knowledge. Your analysis must directly correlate to the provided information.

**Provided Information:**

*   **Symbol:** {{{symbol}}}
*   **Current Price:** {{{marketData.price}}}
*   **User's Risk Level:** {{{riskLevel}}}

**News Analysis:**
*   **Overall Sentiment:** {{{newsSentiment}}}
*   **Reasoning:** {{{newsReasoning}}}

**Technical Indicator Interpretations:**
*   **RSI Analysis:** {{{marketData.rsiInterpretation}}}
*   **ADX Analysis:** {{{marketData.adxInterpretation}}}
*   **EMA Analysis:** {{{marketData.emaInterpretation}}}
*   **VWAP Analysis:** {{{marketData.vwapInterpretation}}}
*   **Parabolic SAR Analysis:** {{{marketData.sarInterpretation}}}
*   **Bollinger Bands Analysis:** {{{marketData.bollingerBandsInterpretation}}}

**Your Task:**
1.  **Synthesize:** Combine the news sentiment with all the technical indicator interpretations to form a holistic view of the market for {{{symbol}}}.
2.  **Determine Signal:** Based on your synthesis, decide on a final trading signal: 'BUY', 'SELL', or 'HOLD'.
3.  **Set Targets:** Calculate the 'entryZone', 'stopLoss', and 'takeProfit' levels. These MUST be mathematically relative to the provided **Current Price ({{{marketData.price}}})**. Adjust the range of these targets based on the **User's Risk Level ({{{riskLevel}}})**:
    *   **Low Risk:** Tighter targets, closer to the current price. (e.g., 1-2% for stop-loss, 2-4% for take-profit)
    *   **Medium Risk:** Moderate targets. (e.g., 3-5% for stop-loss, 5-8% for take-profit)
    *   **High Risk:** Wider targets. (e.g., 6-10% for stop-loss, 10-15% for take-profit)
    *   For a 'BUY' signal, Stop Loss must be below Entry, Take Profit must be above.
    *   For a 'SELL' signal, Stop Loss must be above Entry, Take Profit must be below.
    *   For a 'HOLD' signal, set entry, stop, and profit to "N/A".
4.  **Assess Confidence:** Provide a 'confidence' percentage and an AI 'gptConfidenceScore' (0-100) based on how strongly the combined data points to your decided signal.
5.  **Assess Risk:** Provide an AI-assessed 'riskRating' based on market volatility and indicator alignment.
6.  **Populate Output:** Fill out the entire JSON output object. The interpretations fields (e.g., \`rsiInterpretation\`) should be populated with the exact interpretation text provided above.

**Disclaimer:**
Provide this exact disclaimer: "This is not financial advice. All trading involves risk. Past performance is not indicative of future results. Always do your own research."

**Final Output:**
Adhere strictly to the output JSON format. The output 'symbol' field must match the input 'symbol' field. All generated values MUST be directly derived from the provided information.
`,
});


const generateTradingSignalFlow = ai.defineFlow(
  {
    name: 'generateTradingSignalFlow',
    inputSchema: GenerateTradingSignalInputSchema,
    outputSchema: GenerateTradingSignalOutputSchema,
  },
  async input => {
    const symbolToNameMapping: Record<string, string> = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'SOL': 'Solana',
        'XRP': 'Ripple',
        'DOGE': 'Dogecoin',
    };
    
    const newsQuery = symbolToNameMapping[input.symbol] || input.symbol;

    // 1. Fetch all data first
    const marketData = await getMarketData(input.symbol);
    const news = await fetchNews(newsQuery); // Using a simplified news tool for now

    // 2. Prepare data for the prompt
    const newsSentiment = news.length > 0 ? "Neutral" : "Unavailable"; // Simplified sentiment
    const newsReasoning = news.length > 0 
        ? `Based on headlines like "${news[0].title}", the sentiment is neutral.` 
        : "News data was not available for sentiment analysis.";

    // 3. Call the AI with pre-processed data
    const {output} = await generateTradingSignalPrompt({ 
        ...input,
        marketData,
        newsSentiment,
        newsReasoning,
    });
    return output!;
  }
);
