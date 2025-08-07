/**
 * @fileoverview Service for interacting with the NewsAPI to fetch articles.
 */

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: {
    title: string;
    description: string;
    url: string;
    source: {
      id: string | null;
      name: string;
    };
  }[];
}

/**
 * Fetches the top 3 news articles for a given query.
 * @param query The search term for news (e.g., "Bitcoin").
 * @returns A promise that resolves to an array of news articles.
 */
export async function getNews(
  query: string
): Promise<{title: string; description: string; url: string}[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.error('NEWS_API_KEY is not set in the environment variables.');
    throw new Error('Server configuration error: The news service is currently unavailable.');
  }

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&sortBy=publishedAt&pageSize=3&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        const errorBody = await response.json();
        console.error("NewsAPI request failed:", errorBody);
        throw new Error(`Failed to fetch news. Status: ${response.status}.`);
    }
    const data: NewsApiResponse = await response.json();

    if (!data.articles || data.articles.length === 0) {
        return [{title: `No recent news found for ${query}`, description: 'Please try another search term or check back later.', url: '#'}]
    }

    return data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    if (error instanceof Error && error.message.startsWith('Failed to fetch news')) {
        throw error;
    }
    throw new Error('An unexpected error occurred while fetching news.');
  }
}
