import { Timestamp } from 'firebase/firestore'

export interface BaseDocument {
  id: string
  user_id: string
  created_at: Timestamp
}

export interface PaginationOptions {
  limit?: number
  offset?: number
}

export interface DateRange {
  start_date: string
  end_date: string
}
