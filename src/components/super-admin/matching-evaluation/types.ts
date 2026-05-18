export interface TestPair {
  id: string
  group: 'strong_match' | 'borderline' | 'no_match'
  groupLabel: string
  category: string
  subcategory: string
  score: number
  groundTruth: 'MATCH' | 'NO_MATCH'
  note: string
  lostPost: Record<string, string>
  foundPost: Record<string, string>
}

export interface ThresholdPoint {
  threshold: number
  TP: number
  FP: number
  TN: number
  FN: number
  precision: number
  recall: number
  f1: number
}

export interface TestData {
  meta: {
    selectedThreshold: number
    thresholdRationale: string
    metricsAtSelectedThreshold: {
      threshold: number
      TP: number
      FP: number
      TN: number
      FN: number
      precision: number
      recall: number
      f1: number
    }
    distribution: {
      totalPairs: number
      matchPairs: number
      noMatchPairs: number
    }
  }
  pairs: TestPair[]
  thresholdAnalysis: ThresholdPoint[]
}
