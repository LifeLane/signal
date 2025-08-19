
/**
 * @fileoverview Service for interacting with CoinMarketCap and CoinGecko to fetch market data.
 */
import fetch from 'node-fetch';
import { generateRealisticMarketData, RealisticData } from './mock-data-generator';

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


export type MarketData = RealisticData & {
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume24h: number;
  marketCap: number;
  fearAndGreed?: FearAndGreed;
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

export interface ShadowTokenDetails {
    address: string;
    name: string;
    symbol: string;
    price: number;
    priceChange24h: number;
    marketCap: number;
    solPrice?: number; // Price of SHADOW in SOL
}

const SHADOW_CONTRACT_ADDRESS = "B6XHf6ouZAy5Enq4kR3Po4CD5axn1EWc7aZKR9gmr2QR";
const SOL_MINT_ADDRESS = "So11111111111111111111111111111111111111112";
const SHADOW_COINGECKO_ID = { id: 'shadow-shadow', name: 'SHADOW (SHADOW)', symbol: 'SHADOW' };


// A helper function to find a coin's ID and name from a symbol, name, or address
const getCoinGeckoInfo = async (query: string): Promise<SearchResult> => {
    // 1. If it's the SHADOW token, return the hardcoded ID to avoid lookup issues.
    if (query.toUpperCase() === 'SHADOW' || query === SHADOW_CONTRACT_ADDRESS) {
        return SHADOW_COINGECKO_ID;
    }

    // 2. Fallback to searching the CoinGecko API for tickers or names for other coins
    try {
        const searchUrl = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
        const searchResponse = await fetch(searchUrl);
        if(searchResponse.ok) {
            const searchData = await searchResponse.json();
            const exactMatch = searchData.coins.find((c: any) => c.symbol.toLowerCase() === query.toLowerCase() || c.id === query.toLowerCase());
            if (exactMatch) {
                 return { id: exactMatch.id, name: exactMatch.name, symbol: exactMatch.symbol.toUpperCase() };
            }
            if (searchData.coins && searchData.coins.length > 0) {
                const topResult = searchData.coins[0];
                return { id: topResult.id, name: topResult.name, symbol: topResult.symbol.toUpperCase() };
            }
        }
    } catch(e) {
        console.error('Error searching CoinGecko', e);
    }
    
    // 3. If all else fails, use the query as a fallback
    const fallbackSymbol = query.length <= 5 ? query.toUpperCase() : "UNKNOWN";
    return { id: query.toLowerCase(), name: query.toUpperCase(), symbol: fallbackSymbol };
}

// Special function to get SHADOW data from GeckoTerminal API as a fallback
async function getShadowTokenData(): Promise<MarketData> {
    const url = 'https://api.geckoterminal.com/api/v2/networks/solana/pools/3rwADkcUfcGWW2j2u3SXSdhJDRMDzWVVUgycnPSFg97o';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GeckoTerminal request failed with status: ${response.status}`);
        }
        const data = await response.json();
        
        const price = parseFloat(data.data.attributes.base_token_price_usd);
        const volume = parseFloat(data.data.attributes.volume_usd.h24);

        const indicators = generateRealisticMarketData(price);

        return {
            ...indicators,
            name: "SHADOW (SHADOW)",
            symbol: "SHADOW",
            price: price,
            change: 0, // GeckoTerminal pool data doesn't include 24h change
            volume24h: volume,
            marketCap: price * 10_000_000_000, // Total Supply * Price
            fearAndGreed: await getFearAndGreedIndex(),
        };

    } catch (error) {
        console.error('Failed to fetch SHADOW data from GeckoTerminal, generating mock data.', error);
        // Fallback to mock data if API fails
        const price = 0.00012345;
        const indicators = generateRealisticMarketData(price);
        return {
            ...indicators,
            name: "SHADOW (SHADOW)",
            symbol: "SHADOW",
            price: price,
            change: -5.5,
            volume24h: 50000,
            marketCap: price * 10_000_000_000,
        };
    }
}


export async function getShadowTokenDetails(): Promise<ShadowTokenDetails> {
    const apiKey = process.env.BIRDEYE_API_KEY;
    if (!apiKey) {
        throw new Error('Server configuration error: BirdEye API key is not available.');
    }

    const url = `https://public-api.birdeye.so/defi/price?address=${SHADOW_CONTRACT_ADDRESS}`;
    const solUrl = `https://public-api.birdeye.so/defi/price?address=${SOL_MINT_ADDRESS}`;

    const options = {
        method: 'GET',
        headers: {
            'X-API-KEY': apiKey,
            'accept': 'application/json',
            'x-chain': 'solana'
        }
    };

    try {
        const [shadowResponse, solResponse] = await Promise.all([
            fetch(url, options),
            fetch(solUrl, options)
        ]);

        if (!shadowResponse.ok) {
            const errorBody = await shadowResponse.text();
            throw new Error(`BirdEye API request for SHADOW failed with status ${shadowResponse.status}: ${errorBody}`);
        }
         if (!solResponse.ok) {
            const errorBody = await solResponse.text();
            throw new Error(`BirdEye API request for SOL failed with status ${solResponse.status}: ${errorBody}`);
        }

        const shadowData = await shadowResponse.json();
        const solData = await solResponse.json();
        
        if (!shadowData.success || !shadowData.data || typeof shadowData.data.value === 'undefined') {
            throw new Error('BirdEye API returned unsuccessful or invalid response for SHADOW price.');
        }
        if (!solData.success || !solData.data || typeof solData.data.value === 'undefined') {
            throw new Error('BirdEye API returned unsuccessful or invalid response for SOL price.');
        }
        
        const price = shadowData.data.value;
        const priceOfSol = solData.data.value;

        const overviewUrl = `https://public-api.birdeye.so/defi/token_overview?address=${SHADOW_CONTRACT_ADDRESS}`;
        const overviewResponse = await fetch(overviewUrl, {
            method: 'GET',
            headers: { 'X-API-KEY': apiKey }
        });
        if (!overviewResponse.ok) {
            throw new Error(`BirdEye overview request failed: ${overviewResponse.status}`);
        }
        const overviewData = await overviewResponse.json();
        if (!overviewData.success || !overviewData.data) {
            throw new Error('Invalid overview data from BirdEye');
        }

        return {
            address: SHADOW_CONTRACT_ADDRESS,
            name: 'SHADOW',
            symbol: 'SHADOW',
            price: price,
            priceChange24h: overviewData.data.priceChange24hPercent,
            marketCap: overviewData.data.mc,
            solPrice: price / priceOfSol,
        };
    } catch (error) {
        console.error('Error fetching SHADOW token details from BirdEye:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while fetching token details.');
    }
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
      .slice(0, 15) // Return top 15 results
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

// Fetch the top 100 coins by market cap
export async function getTopCoins(): Promise<SearchResult[]> {
    try {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
        const response = await fetch(url);
         if (!response.ok) {
            console.error(`CoinGecko top coins API request failed with status ${response.status}`);
            return [];
        }
        const data = await response.json();
        return data.map((coin: any) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
        }));

    } catch (error) {
        console.error('Error fetching top coins from CoinGecko:', error);
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
            return null; // Return null if the symbol is not found or another error occurs
        }
        const data = await response.json();
        if (data && data.length > 0) {
            const longAccount = parseFloat(data[0].longAccount);
            const shortAccount = parseFloat(data[0].shortAccount);
            return (longAccount / (longAccount + shortAccount)) * 100;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching Long/Short ratio for ${binanceSymbol}:`, error);
        return null;
    }
}

/**
 * Fetches market data for a given symbol.
 * @param symbol The crypto symbol (e.g., "BTC", "ETH", or a contract address).
 * @returns A promise that resolves to the market data.
 */
export async function getMarketData(symbol: string): Promise<MarketData> {
    if (symbol.toUpperCase() === 'SHADOW' || symbol === SHADOW_CONTRACT_ADDRESS) {
        return getShadowTokenData();
    }
  try {
    const coinInfo = await getCoinGeckoInfo(symbol);
    
    // Fetch all data in parallel
    const [
        priceDataResponse, 
        fearAndGreed, 
        historicalData,
        longShortRatio
    ] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinInfo.id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`),
        getFearAndGreedIndex(),
        getHistoricalData(coinInfo.id),
        getLongShortRatio(coinInfo.symbol)
    ]);


    if (!priceDataResponse.ok) {
        // Fallback for SHADOW token if CoinGecko fails
        if (coinInfo.id === SHADOW_COINGECKO_ID.id) {
            console.warn('CoinGecko failed for SHADOW, falling back to GeckoTerminal');
            return getShadowTokenData();
        }
      throw new Error(`CoinGecko price API request failed with status ${priceDataResponse.status}`);
    }
    const priceData: CoinGeckoSimplePriceResponse = await priceDataResponse.json() as CoinGeckoSimplePriceResponse;
    const data = priceData[coinInfo.id];

    if (!data) {
        if (coinInfo.id === SHADOW_COINGECKO_ID.id) {
            console.warn('No data for SHADOW in CoinGecko response, falling back to GeckoTerminal');
            return getShadowTokenData();
        }
      throw new Error(`No data found for symbol "${symbol}" (CoinGecko ID: "${coinInfo.id}") in CoinGecko response.`);
    }
    
    const indicators = generateRealisticMarketData(data.usd);
    
    return {
      name: coinInfo.name,
      symbol: coinInfo.symbol.toUpperCase(),
      price: data.usd,
      change: data.usd_24h_change,
      volume24h: data.usd_24h_vol,
      marketCap: data.usd_market_cap,
      ...indicators,
      longShortRatio: longShortRatio ?? indicators.longShortRatio,
      fearAndGreed: fearAndGreed,
      volatility: {
          atr: historicalData.atr,
          ...indicators.volatility,
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
