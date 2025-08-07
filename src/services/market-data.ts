
/**
 * @fileoverview Service for interacting with CoinMarketCap and CoinGecko to fetch market data.
 */
import fetch from 'node-fetch';

export interface CandlestickPattern {
    name: string;
    timestamp: string;
    confidence: number;
    description: string;
}

export interface PriceHistoryPoint {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface MarketData {
  name: string;
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
  support: number;
  resistance: number;
  patterns: CandlestickPattern[];
  fearAndGreed: { value: number; classification: string };
  momentum: { trend: string; analysis: string; };
  volatility: { atr: number; vxi: number; };
  volumeProfile: { time: string; volume: number }[];
  priceHistory: PriceHistoryPoint[];
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
        usd_24h_change: number;
        usd_24h_vol: number;
        usd_market_cap: number;
    }
}
interface CoinGeckoCoinResponse {
    id: string;
    symbol: string;
    name: string;
}

const getFearAndGreedClassification = (value: number): string => {
    if (value <= 20) return "Extreme Fear";
    if (value <= 40) return "Fear";
    if (value <= 60) return "Neutral";
    if (value <= 80) return "Greed";
    return "Extreme Greed";
};


const generatePriceHistory = (price: number): PriceHistoryPoint[] => {
    const data: PriceHistoryPoint[] = [];
    let currentPrice = price * (1 - (Math.random() - 0.5) * 0.2); // Start 20% away from current
    for (let i = 0; i < 30; i++) {
        const open = currentPrice;
        const high = open * (1 + Math.random() * 0.025); // up to 2.5% higher
        const low = open * (1 - Math.random() * 0.025); // up to 2.5% lower
        const close = low + Math.random() * (high - low); // somewhere between high and low
        
        const date = new Date();
        date.setDate(date.getDate() - (30 - i));

        data.push({
            time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            open,
            high,
            low,
            close,
        });

        currentPrice = close * (1 + (Math.random() - 0.5) * 0.03); // next day's open
    }
    // ensure last point is the current price
    data[data.length - 1].close = price;
    data[data.length - 1].high = Math.max(data[data.length - 1].high, price);
    data[data.length - 1].low = Math.min(data[data.length - 1].low, price);
    return data;
}

// This function fakes technical indicator data for now.
// In a real application, you would use a library like 'technicalindicators'
// and real historical data to calculate these values.
const generateTechnicalIndicators = (price: number) => {
    // Simulate some realistic volatility and indicator behavior.
    const volatility = 0.05; // 5% volatility
    const randomFactor = () => (Math.random() - 0.5) * 2; // -1 to 1

    const rsi = 50 + randomFactor() * 25; // e.g., 25 to 75
    const adx = 25 + randomFactor() * 15; // e.g., 10 to 40
    const ema = price * (1 - 0.02 * randomFactor());
    const vwap = price * (1 - 0.01 * randomFactor());
    const sar = price * (1 - 0.03 * (Math.random() > 0.5 ? 1 : -1));
    const upperBand = price * (1 + volatility);
    const lowerBand = price * (1 - volatility);

    const fearAndGreedValue = Math.floor(Math.random() * 101);

    const volumeProfileData = [
        { time: '00:00', volume: Math.random() * 1000 },
        { time: '04:00', volume: Math.random() * 1000 },
        { time: '08:00', volume: Math.random() * 1000 },
        { time: '12:00', volume: Math.random() * 1000 },
        { time: '16:00', volume: Math.random() * 1000 },
        { time: '20:00', volume: Math.random() * 1000 },
    ];


    return {
        longShortRatio: 50 + randomFactor() * 10, // e.g., 40% to 60%
        rsi,
        ema,
        vwap,
        bollingerBands: {
          upper: upperBand,
          lower: lowerBand,
        },
        sar,
        adx,
        support: price * (1 - volatility * 1.5),
        resistance: price * (1 + volatility * 1.5),
        patterns: [
            {
                name: "Morning Star",
                timestamp: "7-22 05:30",
                confidence: 95.00,
                description: "Bullish reversal pattern formed over three candles, indicating a potential bottom and shift from bearish to bullish sentiment",
            },
            {
                name: "Three White Soldiers",
                timestamp: "7-21 11:00",
                confidence: 88.50,
                description: "Strong bullish signal indicating a potential reversal of a downtrend.",
            }
        ],
        fearAndGreed: {
            value: fearAndGreedValue,
            classification: getFearAndGreedClassification(fearAndGreedValue)
        },
        momentum: {
            trend: "Weak Uptrend",
            analysis: "Increased Downtrend potential",
        },
        volatility: {
            atr: price * volatility,
            vxi: 30 + randomFactor() * 10,
        },
        volumeProfile: volumeProfileData,
        priceHistory: generatePriceHistory(price),
    }
}

const coinMapping: { [key: string]: {id: string, name: string} } = {
    'BTC': { id: 'bitcoin', name: 'Bitcoin' },
    'ETH': { id: 'ethereum', name: 'Ethereum' },
    'XRP': { id: 'ripple', name: 'Ripple' },
    'SOL': { id: 'solana', name: 'Solana' },
    'DOGE': { id: 'dogecoin', name: 'Dogecoin' },
};

const getCoinGeckoInfo = (symbol: string): {id: string, name: string} => {
    return coinMapping[symbol.toUpperCase()] || { id: symbol.toLowerCase(), name: symbol };
}


/**
 * Fetches market data for a given symbol. It first tries CoinMarketCap, then falls back to CoinGecko.
 * @param symbol The crypto symbol (e.g., "BTC", "ETH").
 * @returns A promise that resolves to the market data.
 */
export async function getMarketData(symbol: string): Promise<MarketData> {
  // First, try CoinMarketCap
  const cmcApiKey = process.env.COINMARKETCAP_API_KEY;
  if (cmcApiKey) {
    try {
      const cmcUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`;
      const cmcResponse = await fetch(cmcUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': cmcApiKey,
          'Accept': 'application/json',
        },
      });

      if (cmcResponse.ok) {
        const cmcData: CmcResponse = await cmcResponse.json() as CmcResponse;
        const data = cmcData.data[symbol];
        const quote = data?.quote?.USD;
        if (quote) {
          console.log(`Successfully fetched data from CoinMarketCap for ${symbol}`);
          const indicators = generateTechnicalIndicators(quote.price);
          return {
            name: data.name,
            price: quote.price,
            change: quote.percent_change_24h,
            volume24h: quote.volume_24h,
            marketCap: quote.market_cap,
            ...indicators,
          };
        }
      } else {
        // Log CMC error but don't throw, to allow fallback
        console.warn(`CoinMarketCap request for ${symbol} failed with status ${cmcResponse.status}. Falling back to CoinGecko.`);
      }
    } catch (error) {
      console.warn(`Error fetching from CoinMarketCap for ${symbol}:`, error, `Falling back to CoinGecko.`);
    }
  } else {
    console.log("COINMARKETCAP_API_KEY not found, using CoinGecko as default.");
  }

  // Fallback to CoinGecko
  try {
    const coinInfo = getCoinGeckoInfo(symbol);
    const cgUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinInfo.id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

    const cgResponse = await fetch(cgUrl);
    if (!cgResponse.ok) {
      throw new Error(`CoinGecko API request failed with status ${cgResponse.status}`);
    }
    const cgData: CoinGeckoSimplePriceResponse = await cgResponse.json() as CoinGeckoSimplePriceResponse;
    const data = cgData[coinInfo.id];

    if (!data) {
      throw new Error(`No data found for symbol "${symbol}" (CoinGecko ID: "${coinInfo.id}") in CoinGecko response.`);
    }
    
    console.log(`Successfully fetched data from CoinGecko for ${symbol}`);
    const indicators = generateTechnicalIndicators(data.usd);
    
    return {
      name: coinInfo.name,
      price: data.usd,
      change: data.usd_24h_change,
      volume24h: data.usd_24h_vol,
      marketCap: data.usd_market_cap,
      ...indicators,
    };
  } catch (error) {
    console.error(`Fatal: Could not fetch market data for ${symbol} from any source.`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching market data.');
  }
}
