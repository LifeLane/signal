'use server';

/**
 * @fileOverview A tool for fetching the latest news articles.
 *
 * - fetchNews - A Genkit tool that retrieves news based on a query.
 */

import {ai} from '@/ai/genkit';
import {getNews} from '@/services/news';
import {z} from 'zod';

export const fetchNews = ai.defineTool(
  {
    name: 'fetchNews',
    description:
      'Fetches news articles from the web based on a search query. Returns the top 3 headlines.',
    inputSchema: z.object({
      query: z.string().describe('The search query for news articles.'),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        url: z.string().url(),
      })
    ),
  },
  async input => {
    console.log(`Fetching news for query: ${input.query}`);
    return await getNews(input.query);
  }
);
