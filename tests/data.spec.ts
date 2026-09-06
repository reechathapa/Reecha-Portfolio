import { test, expect } from '@playwright/test'
import { classifyIntent } from '../src/data/intents'
import { chartPath, chartPoints, performanceSeries } from '../src/data/performance'

for (const [query, expected] of [
  ['how to care for an olive tree', 'learn'],
  ['BEST indoor plants', 'compare'],
  ['compare workflow alternatives', 'compare'],
  ['buy an indoor olive tree', 'act'],
  ['book a quiet retreat', 'act'],
  ['a new question without an obvious signal', 'learn'],
] as const) {
  test(`local intent heuristic: ${query}`, () => expect(classifyIntent(query)).toBe(expected))
}

test('illustrative metrics match the explicitly labeled underlying model', () => {
  for (const series of performanceSeries) {
    expect(series.values).toHaveLength(12)
    expect(chartPoints(series.values, series.max)).toHaveLength(12)
    expect(chartPath(series.values, series.max).match(/[ML]/g)).toHaveLength(12)
    expect(series.values.every(value => value >= 0 && value <= series.max)).toBeTruthy()
    const multiplier = series.values[11] / series.values[0]
    if (series.suffix === '×') expect(multiplier).toBeCloseTo(series.value, 1)
    else expect(Math.round((multiplier - 1) * 100)).toBe(series.value)
  }
})
