export type Project = {
  id: string
  brand: string
  category: string
  categoryId: string
  title: string
  subtitle: string
  tags: string[]
  brief: string
  challenge: string
  approach: string[]
  outcome: string
}

export const projects: Project[] = [
  {
    id: 'verdant', brand: 'Verdant', category: 'E-commerce', categoryId: 'ecommerce',
    title: 'Making room for organic growth.', subtitle: 'A search-led strategy for a greener home.',
    tags: ['Search strategy', 'Content architecture'],
    brief: 'A self-initiated strategy exploration for an imagined plant and homeware brand. The question: how could a small store become a genuinely useful destination, long before someone is ready to buy?',
    challenge: 'Product pages can answer “what does it cost?” without answering “is this right for my space?” The concept explores the gap between those two questions.',
    approach: ['Map care, comparison, and purchase intent to distinct page types.', 'Connect useful editorial guides to relevant product collections.', 'Prioritize crawlable navigation, clear product information, and a consistent measurement plan.'],
    outcome: 'A proposed content ecosystem, an intent-led navigation model, and a measurement framework. No live campaign was run and no client results are claimed.',
  },
  {
    id: 'orbit', brand: 'Orbit', category: 'B2B SaaS', categoryId: 'saas',
    title: 'Less noise. More qualified discovery.', subtitle: 'Connecting a product to the problems it solves.',
    tags: ['Intent mapping', 'Product-led content'],
    brief: 'A self-initiated positioning and search concept for an imagined team-workflow platform. The focus is meaningful product discovery, not traffic for traffic’s sake.',
    challenge: 'Broad productivity terms hide very different needs. A team looking for a status-report template does not need the same page as a buyer comparing workflow platforms.',
    approach: ['Group queries by the job someone is trying to get done.', 'Create a clear journey from practical resource to product use case.', 'Define qualified discovery around relevant demo interest rather than raw page views.'],
    outcome: 'A proposed use-case architecture and editorial brief system. This is an independent concept, not a commissioned engagement or verified business result.',
  },
  {
    id: 'stillhouse', brand: 'Stillhouse', category: 'Local discovery', categoryId: 'local',
    title: 'A considered place. An easier discovery.', subtitle: 'Helping the right stay find the right people.',
    tags: ['Local search', 'Experience-led content'],
    brief: 'A self-initiated discovery strategy for an imagined boutique retreat. The opportunity is to connect practical travel questions with a distinctive sense of place.',
    challenge: 'Beautiful imagery alone does not answer the details that help someone decide: where to stay, how to get there, and what kind of experience to expect.',
    approach: ['Organize useful location and experience information around real travel decisions.', 'Build consistent local information and accessible, descriptive page content.', 'Connect discovery pages to clear availability and enquiry paths.'],
    outcome: 'A proposed local-content system and measurement plan for qualified enquiries. The property, brand, and campaign are illustrative.',
  },
]
