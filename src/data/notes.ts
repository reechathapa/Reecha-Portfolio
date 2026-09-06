export type Note = {
  id: string
  title: string
  category: string
  readTime: string
  intro: string
  sections: { heading: string; paragraphs: string[] }[]
  takeaway: string
}

export const notes: Note[] = [
  {
    id: 'beyond-rankings', title: 'Rankings are a signal. Not the whole story.', category: 'PERSPECTIVE', readTime: '3 MIN READ',
    intro: 'A higher position can be useful. But before celebrating the movement, it helps to ask a more interesting question: what did that visibility make possible?',
    sections: [
      { heading: 'Start with the decision, not the dashboard.', paragraphs: ['A report is only useful if it helps someone decide what to do. If the business needs more qualified enquiries, a ranking chart is one piece of the picture, not the definition of success.', 'Write down the question first. Are the right people discovering the site? Are they finding a useful next step? Are those actions relevant to the business? Each question calls for a different signal.'] },
      { heading: 'Keep context next to the number.', paragraphs: ['A page can gain traffic because it reaches a broader audience, because demand has changed, or because its search presence has improved. Those explanations do not call for the same next move.', 'Look at query intent, relevant landing pages, and the quality of the next action together. Where possible, compare like-for-like time periods and annotate major changes. Avoid treating a correlation as proof that one change caused another.'] },
      { heading: 'Make the next step visible.', paragraphs: ['The last line of a useful report is not “traffic is up.” It is a considered recommendation: investigate this drop, improve that journey, or test this hypothesis.', 'Rankings still belong in the picture. They simply work better as evidence in a larger story than as the story itself.'] },
    ],
    takeaway: 'Measure visibility. Understand the context. Make a better decision.',
  },
  {
    id: 'better-keywords', title: 'The best keyword isn’t always the biggest.', category: 'SEARCH INTENT', readTime: '3 MIN READ',
    intro: 'Search volume is easy to put in a spreadsheet. Relevance takes more thought. The opportunity often appears when you stop treating them as the same thing.',
    sections: [
      { heading: 'A query is the start of a conversation.', paragraphs: ['“Indoor plants” and “which indoor plant is safe around cats?” may belong to the same broad topic. They do not represent the same need. One person might be browsing; the other has a specific decision to make.', 'Before choosing a page format, write a plain-language sentence about what the person is trying to achieve. If that sentence is vague, the brief probably is too.'] },
      { heading: 'Look for a useful fit.', paragraphs: ['Consider relevance to the business, the available evidence about demand, the current search landscape, and whether the site can offer something genuinely useful. A term with a large estimate is not automatically a better investment.', 'A smaller, well-matched question can be worth answering because it removes a real obstacle. That does not guarantee a conversion; it creates a clearer reason for the content to exist.'] },
      { heading: 'Build a journey, not a pile of pages.', paragraphs: ['A guide helps someone understand. A comparison helps them weigh options. A product or service page helps them act. Link those experiences where the next step is natural, not simply because an internal-link target exists.', 'The aim is not to turn every article into a sales pitch. It is to give a person a useful answer now and an understandable path forward if they need one.'] },
    ],
    takeaway: 'The better keyword is the one you can serve with a genuinely better answer.',
  },
  {
    id: 'useful-dashboards', title: 'Less reporting. More understanding.', category: 'MEASUREMENT', readTime: '3 MIN READ',
    intro: 'A dashboard can hold a hundred charts and still leave its reader asking what happened. Clear reporting is an editorial task as much as a technical one.',
    sections: [
      { heading: 'Give the page one job.', paragraphs: ['Who is reading this, and what decision will they make? A weekly working view for an SEO team and a monthly business review should not contain exactly the same level of detail.', 'Start with a small number of questions. Group the measures around discovery, engagement, and meaningful action. Define each metric close to where it appears so the reader does not have to guess.'] },
      { heading: 'Design for interpretation.', paragraphs: ['Show the comparison period. Label the units. Annotate tracking changes, campaigns, and known gaps. A line without context invites a story that the data may not support.', 'Be explicit about uncertainty. Missing attribution, consent settings, and changes to event definitions can affect interpretation. An honest note is more useful than an apparently precise conclusion that overlooks a limitation.'] },
      { heading: 'End with a reason to act.', paragraphs: ['Separate observations from interpretations and recommendations. “Enquiries fell” is an observation. “The new form caused the drop” is a hypothesis that needs investigation, not a fact established by a chart.', 'A good dashboard makes room for that distinction. It helps a team agree on the next useful question instead of merely agreeing that a number moved.'] },
    ],
    takeaway: 'Less visual noise. More context. A clearer next decision.',
  },
]
