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
      if (process.env.NODE_ENV === 'development') {
        console.warn('NEWS_API_KEY not set. Returning mock news data.');
        return [
            { title: 'Crypto Market Sees Unprecedented Surge', description: 'Experts weigh in on the recent bull run.', url: '#' },
            { title: 'New Regulations Proposed for Digital Assets', description: 'Governments worldwide are considering new frameworks.', url: '#' },
            { title: 'The Rise of Decentralized Finance (DeFi)', description: 'A look into the future of finance.', url: '#' },
        ];
    }
    throw new Error('NEWS_API_KEY is not set in the environment variables.');
  }

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&sortBy=publishedAt&pageSize=3&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NewsAPI request failed with status ${response.status}`);
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
    // Return an empty array or a custom error object
    return [];
  }
}
