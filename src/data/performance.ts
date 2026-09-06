export const performanceSeries = [
  { id: 'traffic', name: 'Organic sessions', label: 'Traffic', value: 184, prefix: '+', suffix: '%', decimals: 0, context: 'More relevant discovery', unit: 'k sessions', values: [12, 12.8, 14.5, 16.2, 16, 20.6, 22.8, 24, 26.8, 30.2, 32.5, 34.1], max: 40 },
  { id: 'visibility', name: 'Search visibility index', label: 'Visibility', value: 2.6, prefix: '', suffix: '×', decimals: 1, context: 'A stronger search presence', unit: 'index', values: [20, 21, 25, 27, 25, 32, 35, 34, 43, 45, 49, 52], max: 60 },
  { id: 'actions', name: 'Qualified actions', label: 'Actions', value: 63, prefix: '+', suffix: '%', decimals: 0, context: 'More meaningful next steps', unit: 'actions', values: [100, 102, 105, 112, 109, 115, 123, 129, 128, 142, 151, 163], max: 200 },
]
export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function chartPoints(values: number[], max: number) { return values.map((value, index) => ({ x: 48 + index * 48, y: 218 - value / max * 180 })) }
export function chartPath(values: number[], max: number) {
  const points = chartPoints(values, max)
  // Equal command counts make GSAP's numeric interpolation stable on tab changes.
  return points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')
}
