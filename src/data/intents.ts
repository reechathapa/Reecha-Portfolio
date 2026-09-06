export const intents = [
  {
    id: 'learn', label: 'Learn something', type: 'Informational',
    query: 'how to care for an olive tree',
    keyword: 'A question to answer', keywordDetail: 'Someone wants to understand.',
    content: 'A genuinely useful guide', contentDetail: 'Clear advice. Real next steps.',
    page: 'Olive tree care, made simple',
    outcome: 'Earn trust', outcomeDetail: 'Be helpful before being promotional.',
    measure: 'Engaged readers & return visits',
  },
  {
    id: 'compare', label: 'Compare options', type: 'Commercial',
    query: 'best indoor trees for low light',
    keyword: 'Options to weigh up', keywordDetail: 'Someone is finding their fit.',
    content: 'An honest comparison', contentDetail: 'Help make a confident choice.',
    page: 'Find the right tree for your space',
    outcome: 'Build confidence', outcomeDetail: 'Make the differences easy to understand.',
    measure: 'Relevant product discovery',
  },
  {
    id: 'act', label: 'Take action', type: 'Transactional',
    query: 'buy indoor olive tree',
    keyword: 'A decision to make', keywordDetail: 'Someone is ready for the next step.',
    content: 'A clear product page', contentDetail: 'Useful detail. Less friction.',
    page: 'Your indoor olive tree',
    outcome: 'Enable action', outcomeDetail: 'Make that next step feel effortless.',
    measure: 'Qualified enquiries & conversions',
  },
] as const

export type IntentId = typeof intents[number]['id']

// Deliberately transparent, local heuristics. Not an AI or search-volume API.
export function classifyIntent(query: string): IntentId {
  if (/\b(buy|book|order|purchase|hire|shop|subscribe|reserve|sign up|near me)\b/i.test(query)) return 'act'
  if (/\b(best|compare|comparison|versus|vs|review|reviews|alternatives?|top|pricing|price|cost)\b/i.test(query)) return 'compare'
  return 'learn'
}
