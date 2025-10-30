import type { BaseDocument, DateRange } from './common.types'

export interface Period extends BaseDocument, DateRange {
  name: string
  budget_goal: number
}

export interface CreatePeriodInput {
  user_id: string
  name: string
  start_date: string
  end_date: string
  budget_goal: number
}

export interface UpdatePeriodInput
  extends Partial<Omit<CreatePeriodInput, 'user_id'>> {}
