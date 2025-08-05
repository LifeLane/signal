'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-trading-signal.ts';
import '@/ai/tools/news-tool.ts';
import '@/ai/tools/market-data-tool.ts';
