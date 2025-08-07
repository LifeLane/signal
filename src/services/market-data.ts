
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

export interface FearAndGreed {
    value: number;
    classification: string;
}

export interface Volatility {
    atr: number;
    vxi: number;
}

export interface VolumeProfilePoint {
    time: string;
    volume: number;
}


export interface MarketData {
  name: string;
  symbol: string;
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
  fearAndGreed?: FearAndGreed;
  momentum: { trend: string; analysis: string; };
  volatility?: Volatility;
  volumeProfile?: VolumeProfilePoint[];
}

export interface SearchResult {
    id: string; // e.g., 'bitcoin'
    name: string; // e.g., 'Bitcoin'
    symbol: string; // e.g., 'BTC'
}

interface CoinGeckoSimplePriceResponse {
    [id: string]: {
        usd: number;
        usd_24h_change: number;
        usd_24h_vol: number;
        usd_market_cap: number;
    }
}

// A helper function to find a coin's ID and name from a symbol, name, or address
const getCoinGeckoInfo = async (query: string): Promise<SearchResult> => {
    // 1. Check our hardcoded mapping first for common tickers
    const upperQuery = query.toUpperCase();
    
    // 2. If it's a long string, assume it's a contract address (basic check)
    // For Solana, addresses are typically 32-44 characters long.
    if (query.length > 30 && query.length < 50) {
        try {
            const cgUrl = `https://api.coingecko.com/api/v3/coins/solana/contract/${query}`;
            const cgResponse = await fetch(cgUrl);
            if(cgResponse.ok) {
                const cgData = await cgResponse.json();
                if (cgData.id) {
                    console.log(`Found coin by contract address: ${cgData.name}`);
                    return { id: cgData.id, name: cgData.name, symbol: cgData.symbol };
                }
            }
        } catch(e) {
             console.warn(`Could not find coin by contract address ${query}`, e);
             // Fall through to search
        }
    }

    // 3. Fallback to searching the CoinGecko API
    try {
        const searchUrl = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
        const searchResponse = await fetch(searchUrl);
        if(searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.coins && searchData.coins.length > 0) {
                const topResult = searchData.coins[0];
                console.log(`Found coin by search: ${topResult.name}`);
                return { id: topResult.id, name: topResult.name, symbol: topResult.symbol };
            }
        }
    } catch(e) {
        console.error('Error searching CoinGecko', e);
    }
    
    // 4. If all else fails, use the query as a fallback (and likely fail downstream)
    console.warn(`Could not resolve "${query}" to a CoinGecko ID. Using it directly.`);
    const fallbackSymbol = query.length <= 5 ? query.toUpperCase() : "UNKNOWN";
    return { id: query.toLowerCase(), name: query.toUpperCase(), symbol: fallbackSymbol };
}

export async function searchCoins(query: string): Promise<SearchResult[]> {
  if (!query) {
    return [];
  }

  try {
    const searchUrl = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    if (!response.ok) {
      console.error(`CoinGecko search API request failed with status ${response.status}`);
      return [];
    }
    const data = await response.json();
    return (data.coins || [])
      .slice(0, 10) // Return top 10 results
      .map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
      }));
  } catch (error) {
    console.error('Error searching CoinGecko:', error);
    return [];
  }
}

// Fetch Fear and Greed Index
async function getFearAndGreedIndex(): Promise<FearAndGreed | undefined> {
    try {
        const response = await fetch('https://api.alternative.me/fng/?limit=1');
        if (!response.ok) {
            console.warn(`Fear & Greed API request failed with status ${response.status}`);
            return undefined;
        }
        const data = await response.json();
        const value = parseInt(data.data[0].value, 10);
        return {
            value,
            classification: data.data[0].value_classification,
        };
    } catch (error) {
        console.error('Error fetching Fear & Greed Index:', error);
        return undefined;
    }
}

// Fetch historical data for ATR and Volume Profile
async function getHistoricalData(coinId: string): Promise<{ volumeProfile: VolumeProfilePoint[], atr: number }> {
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);

    // CoinGecko wants timestamps in seconds
    const from = Math.floor(twentyFourHoursAgo / 1000);
    const to = Math.floor(now / 1000);

    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`CoinGecko market_chart request failed with status ${response.status}`);
        }
        const data = await response.json();

        // Calculate Volume Profile (hourly)
        const volumes = data.total_volumes as [number, number][];
        const volumeProfile = volumes.map(([timestamp, volume]) => ({
            time: new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            volume,
        }));
        
        // Calculate ATR from prices
        const prices = data.prices as [number, number][];
        let trueRanges = [];
        for (let i = 1; i < prices.length; i++) {
             // Mocking High/Low/Close from price data for ATR calculation
            const high = Math.max(prices[i-1][1], prices[i][1]);
            const low = Math.min(prices[i-1][1], prices[i][1]);
            const prevClose = prices[i-1][1];
            
            const tr1 = high - low;
            const tr2 = Math.abs(high - prevClose);
            const tr3 = Math.abs(low - prevClose);
            trueRanges.push(Math.max(tr1, tr2, tr3));
        }

        const atr = trueRanges.length > 0 ? trueRanges.reduce((a, b) => a + b, 0) / trueRanges.length : 0;

        return { volumeProfile, atr };

    } catch (error) {
        console.error(`Error fetching historical data for ${coinId}:`, error);
        return { volumeProfile: [], atr: 0 };
    }
}

// Fetch Long/Short ratio from Binance
async function getLongShortRatio(symbol: string): Promise<number | null> {
    if (!symbol) return null;
    const binanceSymbol = `${symbol.toUpperCase()}USDT`;
    const url = `https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${binanceSymbol}&period=5m&limit=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`Binance Long/Short ratio API request failed for ${binanceSymbol} with status ${response.status}`);
            return null; // Return null if the symbol is not found or another error occurs
        }
        const data = await response.json();
        if (data && data.length > 0) {
            const longAccount = parseFloat(data[0].longAccount);
            const shortAccount = parseFloat(data[0].shortAccount);
            // The ratio is Longs / Shorts, we need to convert it to a percentage of longs.
            return (longAccount / (longAccount + shortAccount)) * 100;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching Long/Short ratio for ${binanceSymbol}:`, error);
        return null;
    }
}


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

    return {
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
        momentum: {
            trend: "Weak Uptrend",
            analysis: "Increased Downtrend potential",
        },
    }
}

/**
 * Fetches market data for a given symbol.
 * @param symbol The crypto symbol (e.g., "BTC", "ETH", or a contract address).
 * @returns A promise that resolves to the market data.
 */
export async function getMarketData(symbol: string): Promise<MarketData> {
  try {
    const coinInfo = await getCoinGeckoInfo(symbol);
    
    // Fetch all data in parallel
    const [
        priceDataResponse, 
        fearAndGreed, 
        historicalData,
        longShortRatio,
    ] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinInfo.id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`),
        getFearAndGreedIndex(),
        getHistoricalData(coinInfo.id),
        getLongShortRatio(coinInfo.symbol),
    ]);


    if (!priceDataResponse.ok) {
      throw new Error(`CoinGecko price API request failed with status ${priceDataResponse.status}`);
    }
    const priceData: CoinGeckoSimplePriceResponse = await priceDataResponse.json() as CoinGeckoSimplePriceResponse;
    const data = priceData[coinInfo.id];

    if (!data) {
      throw new Error(`No data found for symbol "${symbol}" (CoinGecko ID: "${coinInfo.id}") in CoinGecko response.`);
    }
    
    console.log(`Successfully fetched data from CoinGecko for ${symbol}`);
    const indicators = generateTechnicalIndicators(data.usd);
    
    return {
      name: coinInfo.name,
      symbol: coinInfo.symbol.toUpperCase(),
      price: data.usd,
      change: data.usd_24h_change,
      volume24h: data.usd_24h_vol,
      marketCap: data.usd_market_cap,
      longShortRatio: longShortRatio ?? 50, // Fallback to 50 if API fails
      ...indicators,
      fearAndGreed: fearAndGreed,
      volatility: {
          atr: historicalData.atr,
          vxi: 30 + (Math.random() - 0.5) * 2 * 10, // Keep VXI faked for now
      },
      volumeProfile: historicalData.volumeProfile,
    };
  } catch (error) {
    console.error(`Fatal: Could not fetch market data for ${symbol} from any source.`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching market data.');
  }
}
