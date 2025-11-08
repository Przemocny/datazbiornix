import { QualityLevel, QUALITY_CONFIGS } from '@/types/quality'
import {
  shouldApplyDegradation,
  makeMissing,
  corruptEmail,
  corruptPhoneNumber,
  corruptDate,
  corruptNumber,
  corruptString,
  corruptBoolean,
  makeOutOfRange,
  introduceDuplicate,
} from './strategies'

/**
 * Apply data degradation to a single record based on quality level
 */
export function degradeRecord<T extends Record<string, any>>(
  record: T,
  quality: QualityLevel,
  allRecords: T[] = []
): T {
  if (quality === 'ideal') {
    return record
  }

  const config = QUALITY_CONFIGS[quality]
  const degraded = { ...record }

  // Decide if this record should be a duplicate
  if (shouldApplyDegradation(config.duplicateProbability) && allRecords.length > 0) {
    return introduceDuplicate(record, allRecords) as T
  }

  // Apply degradation to each field
  for (const [key, value] of Object.entries(record)) {
    // Skip id, createdAt, updatedAt
    if (key === 'id' || key === 'createdAt' || key === 'updatedAt') {
      continue
    }

    // Missing values
    if (shouldApplyDegradation(config.missingValueProbability)) {
      ;(degraded as any)[key] = makeMissing(value)
      continue
    }

    // Skip if already null/undefined
    if (value === null || value === undefined) {
      continue
    }

    // Field-specific corruptions
    if (key.includes('email') || key.endsWith('Email')) {
      if (shouldApplyDegradation(config.formatErrorProbability)) {
        ;(degraded as any)[key] = corruptEmail(value)
        continue
      }
    }

    if (key.includes('phone') || key.endsWith('Phone')) {
      if (shouldApplyDegradation(config.formatErrorProbability)) {
        ;(degraded as any)[key] = corruptPhoneNumber(value)
        continue
      }
    }

    if (value instanceof Date || key.includes('date') || key.includes('Date')) {
      if (shouldApplyDegradation(config.formatErrorProbability)) {
        ;(degraded as any)[key] = corruptDate(value)
        continue
      }
      if (shouldApplyDegradation(config.outOfRangeProbability)) {
        ;(degraded as any)[key] = makeOutOfRange(key, value)
        continue
      }
    }

    if (typeof value === 'number') {
      if (shouldApplyDegradation(config.wrongTypeProbability)) {
        ;(degraded as any)[key] = corruptNumber(value)
        continue
      }
      if (shouldApplyDegradation(config.outOfRangeProbability)) {
        ;(degraded as any)[key] = makeOutOfRange(key, value)
        continue
      }
    }

    if (typeof value === 'string') {
      if (shouldApplyDegradation(config.formatErrorProbability)) {
        ;(degraded as any)[key] = corruptString(value)
        continue
      }
    }

    if (typeof value === 'boolean') {
      if (shouldApplyDegradation(config.wrongTypeProbability)) {
        ;(degraded as any)[key] = corruptBoolean(value)
        continue
      }
    }
  }

  return degraded
}

/**
 * Apply data degradation to an array of records
 */
export function degradeRecords<T extends Record<string, any>>(
  records: T[],
  quality: QualityLevel
): T[] {
  if (quality === 'ideal') {
    return records
  }

  return records.map(record => degradeRecord(record, quality, records))
}

/**
 * Get quality statistics for degraded data
 */
export function getQualityStats(records: any[], originalCount: number) {
  const missingCount = records.reduce((acc, record) => {
    const missing = Object.values(record).filter(v => v === null || v === undefined || v === '').length
    return acc + missing
  }, 0)

  const totalFields = records.length * (records[0] ? Object.keys(records[0]).length : 0)

  return {
    totalRecords: records.length,
    originalRecords: originalCount,
    missingValues: missingCount,
    missingPercentage: totalFields > 0 ? (missingCount / totalFields) * 100 : 0,
    completeness: totalFields > 0 ? ((totalFields - missingCount) / totalFields) * 100 : 100,
  }
}

