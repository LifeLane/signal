/**
 * @fileoverview Service for interacting with CoinMarketCap to fetch market data.
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
      quote: {
        USD: CmcQuote;
      };
    };
  };
}

// This function fakes technical indicator data for now.
// In a real application, you would use a library like 'technicalindicators'
// and real historical data to calculate these values.
const generateMockIndicators = (price: number) => {
    return {
        longShortRatio: parseFloat((50 + (Math.random() - 0.5) * 5).toFixed(2)),
        rsi: parseFloat((30 + Math.random() * 40).toFixed(2)),
        ema: price * (1 - 0.01 * (Math.random() - 0.5)),
        vwap: price * (1 - 0.01 * (Math.random() - 0.5)),
        bollingerBands: {
        upper: price * 1.05,
        lower: price * 0.95,
        },
        sar: price * (1 - 0.02 * (Math.random() > 0.5 ? 1 : -1)),
        adx: parseFloat((10 + Math.random() * 40).toFixed(2)),
    }
}


/**
 * Fetches market data for a given symbol from CoinMarketCap.
 * @param symbol The crypto symbol (e.g., "BTC", "ETH").
 * @returns A promise that resolves to the market data.
 */
export async function getMarketData(
  symbol: string
): Promise<MarketData> {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    throw new Error('COINMARKETCAP_API_KEY is not set in the environment variables.');
  }

  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('CoinMarketCap API Error:', errorBody);
        throw new Error(`CoinMarketCap API request failed with status ${response.status}: ${errorBody}`);
    }

    const data: CmcResponse = await response.json();
    
    if (data.status.error_code !== 0) {
      throw new Error(`CoinMarketCap API Error: ${data.status.error_message}`);
    }
    
    const quote = data.data[symbol]?.quote?.USD;
    if (!quote) {
        throw new Error(`No data found for symbol ${symbol}`);
    }

    const mockIndicators = generateMockIndicators(quote.price);

    return {
      price: quote.price,
      change: quote.percent_change_24h,
      volume24h: quote.volume_24h,
      marketCap: quote.market_cap,
      ...mockIndicators
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error('Failed to fetch data from CoinMarketCap.');
  }
}
