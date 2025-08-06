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
    return {
        longShortRatio: 50 + (Math.random() - 0.5) * 5,
        rsi: 30 + Math.random() * 40,
        ema: price * (1 - 0.01 * (Math.random() - 0.5)),
        vwap: price * (1 - 0.01 * (Math.random() - 0.5)),
        bollingerBands: {
          upper: price * 1.05,
          lower: price * 0.95,
        },
        sar: price * (1 - 0.02 * (Math.random() > 0.5 ? 1 : -1)),
        adx: 10 + Math.random() * 40,
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

    if (!cmcResponse.ok) {
        const errorBody = await cmcResponse.text();
        console.error('CoinMarketCap API Error:', errorBody);
        throw new Error(`CoinMarketCap API request failed with status ${cmcResponse.status}: ${cmcResponse.statusText}`);
    }

    const cmcData: CmcResponse = await cmcResponse.json();
    
    if (cmcData.status.error_code !== 0) {
      throw new Error(`CoinMarketCap API Error: ${cmcData.status.error_message}`);
    }
    
    const quote = cmcData.data[symbol]?.quote?.USD;
    if (!quote) {
        throw new Error(`No data found for symbol ${symbol} in CoinMarketCap response`);
    }

    // Fetch from CoinGecko to get additional data or for cross-verification
    const coinGeckoId = getCoinGeckoId(symbol);
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`;

    const coinGeckoResponse = await fetch(coinGeckoUrl);
    if (!coinGeckoResponse.ok) {
        console.warn(`CoinGecko API request failed with status ${coinGeckoResponse.status}. Using CoinMarketCap data only.`);
    } else {
        const coinGeckoData: CoinGeckoSimplePriceResponse = await coinGeckoResponse.json();
        const coinGeckoPrice = coinGeckoData[coinGeckoId]?.usd;

        if (coinGeckoPrice) {
            // Optional: You could average the prices or use one as a fallback.
            // For now, we'll just log it and use CMC's comprehensive quote.
            console.log(`CoinGecko price for ${symbol}: ${coinGeckoPrice}`);
        }
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
    console.error('Error fetching market data:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Failed to fetch data from market APIs.');
  }
}
