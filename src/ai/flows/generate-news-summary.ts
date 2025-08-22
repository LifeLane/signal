
'use server';

/**
 * @fileOverview AI-driven news summarization and sentiment analysis.
 *
 * - generateNewsSummary - Analyzes news articles for a given topic and provides a summary and sentiment.
 * - GenerateNewsSummaryInput - The input type for the generateNewsSummary function.
 * - GenerateNewsSummaryOutput - The return type for the generateNewsSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { fetchNews } from '../tools/news-tool';

const GenerateNewsSummaryInputSchema = z.object({
  topic: z.string().describe('The topic to search news for (e.g., Bitcoin, Ethereum).'),
});
export type GenerateNewsSummaryInput = z.infer<typeof GenerateNewsSummaryInputSchema>;

const ArticleSummarySchema = z.object({
    title: z.string().describe('The original title of the news article.'),
    url: z.string().url().describe('The URL of the original article.'),
    summary: z.string().optional().describe('A one-sentence AI-generated summary of the article.'),
    imageUrl: z.string().url().optional().describe('The URL for the article\'s thumbnail image, if available.'),
});

const GenerateNewsSummaryOutputSchema = z.object({
  overallSentiment: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The overall market sentiment derived from the news articles.'),
  sentimentReasoning: z
    .string()
    .describe('A brief, one-sentence explanation for the determined sentiment.'),
  articleSummaries: z.array(ArticleSummarySchema).describe('A list of summaries for the top news articles.'),
  disclaimer: z.string().describe('A standard reminder that news can be fickle.'),
});
export type GenerateNewsSummaryOutput = z.infer<typeof GenerateNewsSummaryOutputSchema>;

export async function generateNewsSummary(
  input: GenerateNewsSummaryInput
): Promise<GenerateNewsSummaryOutput> {
  return generateNewsSummaryFlow(input);
}

const generateNewsSummaryPrompt = ai.definePrompt({
  name: 'generateNewsSummaryPrompt',
  input: { schema: GenerateNewsSummaryInputSchema },
  output: { schema: GenerateNewsSummaryOutputSchema },
  tools: [fetchNews],
  prompt: `You are an expert financial news analyst. Your task is to analyze the latest news for a given cryptocurrency topic, determine the market sentiment, and provide concise summaries of the top articles.

**Instructions:**
1.  **Fetch News:** Call the \`fetchNews\` tool. Use the provided \`topic\` as the value for the \`query\` parameter.
2.  **Analyze Sentiment:** Read the headlines and descriptions of the articles returned by the tool. Based on the overall tone (e.g., positive developments, price drops, regulatory concerns), determine the market sentiment. It must be one of: 'Positive', 'Neutral', or 'Negative'.
3.  **Provide Reasoning:** Write a single, concise sentence explaining *why* you chose that sentiment.
4.  **Summarize Articles:** For each of the top 3-5 articles returned by the tool, provide a one-sentence summary of its key takeaway. Include the original title, URL, and imageUrl if it exists. If you cannot generate a summary, you may omit it.
5.  **Disclaimer:** Provide this exact disclaimer: "Market sentiment can change rapidly. This is a snapshot based on current news, not a prediction."

**Final Output:**
Adhere strictly to the output JSON format. Ensure all analysis is based *exclusively* on the data returned by the \`fetchNews\` tool.
`,
});

const generateNewsSummaryFlow = ai.defineFlow(
  {
    name: 'generateNewsSummaryFlow',
    inputSchema: GenerateNewsSummaryInputSchema,
    outputSchema: GenerateNewsSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await generateNewsSummaryPrompt(input);
    return output!;
  }
);
