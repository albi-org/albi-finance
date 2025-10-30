import { Timestamp } from 'firebase/firestore'
import type { BaseDocument } from './common.types'

export const TRANSACTION_CATEGORIES = [
  'groceries',
  'transport',
  'entertainment',
  'utilities',
  'health',
  'education',
  'other',
] as const

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number]

export interface Transaction extends Omit<BaseDocument, 'created_at'> {
  description?: string
  amount: number
  category: TransactionCategory
  transaction_date: Timestamp
}

export interface CreateTransactionInput {
  user_id: string
  description?: string
  amount: number
  category: TransactionCategory
  transaction_date?: Date | Timestamp
}

export interface UpdateTransactionInput
  extends Partial<Omit<CreateTransactionInput, 'user_id'>> {}
