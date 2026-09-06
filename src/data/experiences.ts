export type Experience = {
  id: string
  company: string
  from: string
  to: string
  role: string
  summary: string
  highlights: string[]
}

export const experiences: Experience[] = [
  {
    id: 'kpo',
    company: 'KPO & Company',
    from: 'Dec 2020',
    to: 'Nov 2022',
    role: 'Content Manager',
    summary: 'Led the editorial engine for a knowledge-process team, turning briefs into a consistent, search-aware publishing rhythm.',
    highlights: [
      'Owned the editorial calendar, briefs, and quality bar across a growing writing team.',
      'Built repeatable style and review guidelines so every piece read like one voice.',
      'Aligned content topics with search demand rather than guesswork.',
    ],
  },
  {
    id: 'next-nepal',
    company: 'Next Nepal Pvt. Ltd',
    from: 'Jan 2021',
    to: 'Apr 2021',
    role: 'Academic Writer',
    summary: 'Researched and wrote structured academic material with a focus on clarity, accuracy, and original argument.',
    highlights: [
      'Produced well-sourced long-form writing to tight turnarounds.',
      'Translated dense research into readable, logically ordered explanations.',
      'Maintained strict referencing and originality standards.',
    ],
  },
  {
    id: 'swotah',
    company: 'Swotah Travel and Adventure',
    from: 'Jan 2023',
    to: 'Mar 2023',
    role: 'SEO Content Writer and Editor',
    summary: 'Wrote and edited travel content built around the questions real travellers search before they book.',
    highlights: [
      'Mapped itinerary and destination pages to practical travel intent.',
      'Edited contributor drafts for structure, accuracy, and on-page SEO.',
      'Tightened internal linking between guides and bookable trips.',
    ],
  },
  {
    id: 'radiant-treks',
    company: 'Radiant Treks',
    from: 'Apr 2023',
    to: 'Feb 2024',
    role: 'SEO Content Strategist',
    summary: 'Shaped the content strategy behind trekking pages — from keyword architecture to the editorial plan that filled it.',
    highlights: [
      'Built an intent-led topic map across routes, seasons, and preparation queries.',
      'Prioritised pages by opportunity instead of volume alone.',
      'Set a measurement plan tied to qualified enquiries, not raw traffic.',
    ],
  },
  {
    id: 'mountain-rock',
    company: 'Mountain Rock Treks & Expedition Pvt. Ltd',
    from: 'Nov 2022',
    to: 'Present',
    role: 'SEO Content Strategist / Content Manager',
    summary: 'Leading content strategy and the team that delivers it, connecting search insight to genuinely useful trekking resources.',
    highlights: [
      'Own the search and content roadmap end to end.',
      'Guide writers with clear briefs, structure, and editorial standards.',
      'Track rankings, engagement, and enquiries to decide what comes next.',
    ],
  },
]
