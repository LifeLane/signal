/**
 * @fileOverview This file defines the database schema for the TradeVision AI application.
 * It includes type definitions for users, subscriptions, and trading signals.
 */

/**
 * Represents a user in the system, identified by their Solana wallet address.
 */
export type User = {
  id: string; // The user's Solana wallet address.
  createdAt: Date;
  subscriptionId?: string; // Foreign key to the Subscription collection.
};

/**
 * Represents a user's subscription plan.
 */
export type Subscription = {
  id: string; // Unique subscription identifier.
  userId: string; // The user this subscription belongs to (wallet address).
  tier: 'Monthly Pro' | 'Yearly Elite' | 'Lifetime Access' | '7-Day Free Trial';
  status: 'active' | 'inactive' | 'cancelled';
  startDate: Date;
  endDate?: Date; // Null for Lifetime Access.
  transactionSignature: string; // The Solana transaction signature for payment.
};

/**
 * Represents a single AI-generated trading signal that has been stored.
 */
export type Signal = {
  id: string; // Unique signal identifier.
  userId: string; // The user who generated this signal.
  createdAt: Date;
  symbol: string; // e.g., 'BTC', 'ETH'.
  signal: 'BUY' | 'SELL' | 'HOLD';
  riskLevel: 'Low' | 'Medium' | 'High';
  justification: string;
  entryZone: string;
  stopLoss: string;
  takeProfit: string;
  confidence: string;
};
