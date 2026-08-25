export interface Category {
  id: string
  name: string
  sortOrder: number
}

export interface Commitment {
  id: string
  name: string
  categoryId: string
  amount: number
  description: string
  active: boolean
}

export type ItemStatus = 'PAID' | 'PENDING'

export interface LineItem {
  id: string
  name: string
  categoryId: string
  amount: number
  description: string
  status: ItemStatus
  isOneOff: boolean
}

export interface MonthDoc {
  id: string
  salary: number
  items: LineItem[]
}
