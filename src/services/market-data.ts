
/**
 * @fileoverview Service for interacting with CoinMarketCap and CoinGecko to fetch market data.
 */

export interface MarketData {
  price: number;
  change: number;
  volume24h: number;
  marketCap: number;
  longShortRatio: number;
  rsi: number;
  ema: number;
  vwap: number;
  bollingerBands: { upper: number; lower: number };
  sar: number;
  adx: number;
}


interface CmcQuote {
    price: number;
    volume_24h: number;
    percent_change_24h: number;
    market_cap: number;
}

interface CmcResponse {
  status: {
    error_code: number;
    error_message: string | null;
  };
  data: {
    [symbol: string]: {
      id: number;
      name: string;
      symbol: string;
      quote: {
        USD: CmcQuote;
      };
    };
  };
}

interface CoinGeckoSimplePriceResponse {
    [id: string]: {
        usd: number;
    }
}

// This function fakes technical indicator data for now.
// In a real application, you would use a library like 'technicalindicators'
// and real historical data to calculate these values.
const generateTechnicalIndicators = (price: number) => {
    // Simulate some realistic volatility and indicator behavior.
    const volatility = 0.05; // 5% volatility
    const randomFactor = () => (Math.random() - 0.5) * 2; // -1 to 1

    return {
        longShortRatio: 50 + randomFactor() * 10, // e.g., 40% to 60%
        rsi: 50 + randomFactor() * 25, // e.g., 25 to 75
        ema: price * (1 - 0.02 * randomFactor()),
        vwap: price * (1 - 0.01 * randomFactor()),
        bollingerBands: {
          upper: price * (1 + volatility),
          lower: price * (1 - volatility),
        },
        sar: price * (1 - 0.03 * (Math.random() > 0.5 ? 1 : -1)),
        adx: 25 + randomFactor() * 15, // e.g., 10 to 40
    }
}

const getCoinGeckoId = (symbol: string): string => {
    const mapping: { [key: string]: string } = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'XRP': 'ripple',
        'SOL': 'solana',
        'DOGE': 'dogecoin',
    };
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
}


/**
 * Fetches market data for a given symbol from CoinMarketCap and CoinGecko.
 * @param symbol The crypto symbol (e.g., "BTC", "ETH").
 * @returns A promise that resolves to the market data.
 */
export async function getMarketData(
  symbol: string
): Promise<MarketData> {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    throw new Error('COINMARKETCAP_API_KEY is not set in the environment variables. Please add it to your .env file.');
  }

  const cmcUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`;

  try {
    // Fetch from CoinMarketCap
    const cmcResponse = await fetch(cmcUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
    });

    // Check for specific HTTP errors like 401 Unauthorized
    if (cmcResponse.status === 401) {
        throw new Error('Unauthorized: Invalid or missing CoinMarketCap API Key. Please check your .env file.');
    }
     if (cmcResponse.status === 400) {
        throw new Error(`Invalid request for symbol "${symbol}". Please check if the symbol is correct and supported.`);
    }

    if (!cmcResponse.ok) {
        const errorBody = await cmcResponse.text();
        console.error('CoinMarketCap API Error:', errorBody);
        throw new Error(`CoinMarketCap API request failed with status ${cmcResponse.status}`);
    }

    const cmcData: CmcResponse = await cmcResponse.json();

    if (cmcData.status.error_code !== 0 && cmcData.status.error_message) {
      // Forward the specific error message from the API
      throw new Error(`CoinMarketCap API Error: ${cmcData.status.error_message}`);
    }

    const quote = cmcData.data[symbol]?.quote?.USD;
    if (!quote) {
        throw new Error(`No data found for symbol "${symbol}" in CoinMarketCap response. It may be an invalid symbol.`);
    }

    const indicators = generateTechnicalIndicators(quote.price);

    return {
      price: quote.price,
      change: quote.percent_change_24h,
      volume24h: quote.volume_24h,
      marketCap: quote.market_cap,
      ...indicators
    };
  } catch (error) {
    console.error(`Full error fetching market data for ${symbol}:`, error);
    if (error instanceof Error) {
        // Re-throw the specific error to be caught by the action
        throw error;
    }
    // Fallback for unknown errors
    throw new Error('An unexpected error occurred while fetching market data.');
  }
}
