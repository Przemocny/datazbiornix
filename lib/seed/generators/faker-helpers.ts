import { faker } from '@faker-js/faker'

export function randomEnum<T extends string>(values: T[]): T {
  return faker.helpers.arrayElement(values)
}

export function randomDecimal(min: number, max: number, decimals: number = 2): number {
  return parseFloat(faker.finance.amount({ min, max, dec: decimals }))
}

export function randomDate(start: Date, end: Date): Date {
  return faker.date.between({ from: start, to: end })
}

export function randomPastDate(days: number = 365): Date {
  return faker.date.past({ days })
}

export function randomFutureDate(days: number = 365): Date {
  return faker.date.future({ days })
}

export function randomPercentage(): number {
  return faker.number.int({ min: 0, max: 100 })
}

export function maybe<T>(value: T, probability: number = 0.5): T | null {
  return faker.datatype.boolean({ probability }) ? value : null
}

export function generateBatchIds(count: number): string[] {
  return Array.from({ length: count }, () => faker.string.uuid())
}

export const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'overdue', 'cancelled'] as const
export const TRANSACTION_TYPES = ['debit', 'credit'] as const
export const LEAD_SOURCES = ['website', 'referral', 'cold_call', 'event', 'social_media'] as const
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'disqualified'] as const
export const DEAL_STAGES = ['proposal', 'negotiation', 'closed_won', 'closed_lost'] as const
export const ACTIVITY_TYPES = ['call', 'email', 'meeting', 'demo'] as const
export const CAMPAIGN_PLATFORMS = ['google_ads', 'facebook', 'linkedin', 'twitter'] as const
export const CAMPAIGN_STATUSES = ['draft', 'active', 'paused', 'completed'] as const
export const PACKAGE_STATUSES = ['received', 'in_transit', 'delivered', 'returned', 'lost'] as const
export const SHIPMENT_STATUSES = ['pending', 'picked_up', 'in_transit', 'delivered', 'failed'] as const
export const MOVEMENT_TYPES = ['inbound', 'outbound', 'transfer', 'adjustment'] as const
export const CUSTOMER_TYPES = ['regular', 'premium', 'vip'] as const
export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const
export const PAYMENT_METHODS = ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'] as const
export const PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'] as const
export const SUPPLIER_ORDER_STATUSES = ['ordered', 'confirmed', 'in_transit', 'received', 'cancelled'] as const
export const PRODUCTION_STATUSES = ['planned', 'in_progress', 'completed', 'failed'] as const
export const PROJECT_STATUSES = ['planning', 'active', 'on_hold', 'completed', 'cancelled'] as const
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const
export const TASK_STATUSES = ['todo', 'in_progress', 'in_review', 'done', 'blocked'] as const

export const CURRENCIES = ['USD', 'EUR', 'GBP']
export const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Operations', 'HR', 'Finance']
export const CATEGORIES = ['Software', 'Hardware', 'Services', 'Consulting', 'Training']
export const CARRIERS = ['DHL', 'FedEx', 'UPS', 'USPS']

