export type QualityLevel = 'ideal' | 'clean' | 'realistic'

export interface DegradationConfig {
  missingValueProbability: number
  wrongTypeProbability: number
  outOfRangeProbability: number
  duplicateProbability: number
  formatErrorProbability: number
}

export const QUALITY_CONFIGS: Record<QualityLevel, DegradationConfig> = {
  ideal: {
    missingValueProbability: 0,
    wrongTypeProbability: 0,
    outOfRangeProbability: 0,
    duplicateProbability: 0,
    formatErrorProbability: 0,
  },
  clean: {
    missingValueProbability: 0.07, // 7%
    wrongTypeProbability: 0.02, // 2%
    outOfRangeProbability: 0.01, // 1%
    duplicateProbability: 0,
    formatErrorProbability: 0.03, // 3%
  },
  realistic: {
    missingValueProbability: 0.12, // 12%
    wrongTypeProbability: 0.05, // 5%
    outOfRangeProbability: 0.04, // 4%
    duplicateProbability: 0.02, // 2%
    formatErrorProbability: 0.07, // 7%
  },
}

