'use server';

import {
  generateTradingSignal,
  type GenerateTradingSignalInput,
  type GenerateTradingSignalOutput,
} from '@/ai/flows/generate-trading-signal';

export async function getTradingSignalAction(
  input: GenerateTradingSignalInput
): Promise<GenerateTradingSignalOutput> {
  try {
    const result = await generateTradingSignal(input);
    return result;
  } catch (error) {
    console.error('Error generating trading signal:', error);
    throw new Error('Failed to generate trading signal. Please try again.');
  }
}
