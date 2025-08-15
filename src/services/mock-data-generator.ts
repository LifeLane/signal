
/**
 * @fileoverview A service for generating more realistic, varied mock market data.
 */

import type { CandlestickPattern, Volatility, VolumeProfilePoint } from './market-data';

// Helper to get a random number in a range
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Helper to pick a random item from an array
const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const possiblePatterns: Omit<CandlestickPattern, 'timestamp' | 'confidence'>[] = [
    { name: 'Bullish Engulfing', description: 'A strong bullish reversal pattern indicating buying pressure is overtaking selling pressure.' },
    { name: 'Bearish Harami', description: 'A bearish reversal pattern suggesting a potential slowdown in the current uptrend.' },
    { name: 'Doji', description: 'Indicates indecision in the market, often appearing at turning points.' },
    { name: 'Hammer', description: 'A bullish reversal pattern that forms after a decline.' },
    { name: 'Shooting Star', description: 'A bearish reversal pattern that can appear at the peak of an uptrend.' },
];

const possibleMomentum = [
    { trend: 'Strong Uptrend', analysis: 'Market shows significant upward momentum, likely to continue.' },
    { trend: 'Consolidating', analysis: 'Market is moving sideways, indicating indecision between buyers and sellers.' },
    { trend: 'Weak Downtrend', analysis: 'Market shows slight downward pressure, caution is advised.' },
    { trend: 'Ranging', analysis: 'Price is fluctuating within a defined channel, look for breakouts.' },
];


export interface RealisticData {
    longShortRatio: number;
    rsi: number;
    ema: number;
    vwap: number;
    bollingerBands: { upper: number; lower: number; };
    sar: number;
    adx: number;
    support: number;
    resistance: number;
    patterns: CandlestickPattern[];
    momentum: { trend: string; analysis: string; };
    volatility: Omit<Volatility, 'atr'>; // ATR is calculated from real data
}

/**
 * Generates a more realistic and varied set of market indicators based on a price.
 * @param price The current price of the asset.
 * @returns A full suite of realistically simulated market data.
 */
export function generateRealisticMarketData(price: number): RealisticData {
    // Simulate market state (e.g., bullish, bearish, neutral)
    const marketState = pickRandom(['bullish', 'bearish', 'neutral']);
    
    let rsi, adx, ema, vwap, sar, longShortRatio, priceOffset;

    switch (marketState) {
        case 'bullish':
            rsi = randomInRange(55, 80); // Higher RSI
            adx = randomInRange(25, 50); // Strong trend
            priceOffset = randomInRange(1.01, 1.05); // Price is likely above moving averages
            longShortRatio = randomInRange(55, 75);
            break;
        case 'bearish':
            rsi = randomInRange(20, 45); // Lower RSI
            adx = randomInRange(25, 50); // Strong trend
            priceOffset = randomInRange(0.95, 0.99); // Price is likely below moving averages
            longShortRatio = randomInRange(25, 45);
            break;
        default: // neutral
            rsi = randomInRange(40, 60); // Neutral RSI
            adx = randomInRange(10, 24); // Weak or no trend
            priceOffset = randomInRange(0.99, 1.01);
            longShortRatio = randomInRange(45, 55);
            break;
    }

    ema = price / priceOffset;
    vwap = price * randomInRange(0.995, 1.005);
    sar = ema * (marketState === 'bullish' ? 0.98 : 1.02); // SAR follows the trend

    // Bollinger Bands should always contain the price
    const volatility = randomInRange(0.03, 0.08);
    const upperBand = Math.max(price, ema) * (1 + volatility);
    const lowerBand = Math.min(price, ema) * (1 - volatility);

    // Support and resistance
    const support = price * (1 - volatility * randomInRange(1.2, 1.8));
    const resistance = price * (1 + volatility * randomInRange(1.2, 1.8));

    // Generate 1-2 random candlestick patterns
    const patternCount = Math.floor(randomInRange(1, 3));
    const patterns = Array.from({ length: patternCount }, () => {
        const pattern = pickRandom(possiblePatterns);
        return {
            ...pattern,
            timestamp: `${new Date().getHours()}:${new Date().getMinutes()}`,
            confidence: randomInRange(75, 98),
        };
    });
    
    return {
        rsi,
        adx,
        ema,
        vwap,
        sar,
        longShortRatio,
        bollingerBands: { upper: upperBand, lower: lowerBand },
        support,
        resistance,
        patterns,
        momentum: pickRandom(possibleMomentum),
        volatility: {
            vxi: randomInRange(20, 70),
        }
    };
}
