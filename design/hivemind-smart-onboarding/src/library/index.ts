/**
 * HiveMind Academy Library Assets & Research Module
 * Centralizes downloaded images, SVGs, brand assets, and research content.
 */

export const ASSETS = {
  logo: '/library/images/logo-text-right.svg',
  iconLogo: '/library/images/ico-logo.svg',
  favicon: '/library/images/favicon.ico',
  structureLearning: '/library/images/structure-learning.jpg',
  usp1: '/library/images/usp-1.jpg',
  usp2: '/library/images/usp-2.png',
  usp3: '/library/images/usp-3.png',
  puzzle: '/library/images/puzzle.jpg',
  consult: '/library/images/consult-and-discover.jpg',
  discuss: '/library/images/discuss-colleague.jpg',
  delivery: '/library/images/delivery-implementation.jpg',
  listenFirst: '/library/images/listen-first.jpg',
  designReality: '/library/images/design-reality.jpg',
  embedIterate: '/library/images/embed-iterate.jpg',
  blog1: '/library/images/blog-01.jpg',
  blog3: '/library/images/blog-03.jpg',
} as const;

export const HIVEMIND_RESEARCH = {
  brand: {
    name: 'HiveMind Academy',
    tagline: 'Personalised onboarding and knowledge systems. Tailored to your organisation.',
    subtagline: 'Making onboarding and knowledge feel clear, accessible and repeatable.',
    colors: {
      charcoal: '#383C42',
      honey: '#FFC370',
      pink: '#F4B8BD',
      sage: '#BAC9C5',
    },
  },
  valuePropositions: [
    {
      id: 'usp-1',
      title: 'Role-specific, personalised journeys',
      body: 'We design learning and onboarding journeys around real roles, teams and workflows. Each path reflects your context, tools and priorities, so people learn exactly what they need to do their job well, from day one.',
      image: ASSETS.usp1,
    },
    {
      id: 'usp-2',
      title: 'Context-Aware Guidance',
      body: 'Our platform surfaces the right documentation, guidance and next steps at the exact right moment, helping new starters find answers instantly without interrupting colleagues.',
      image: ASSETS.usp2,
    },
    {
      id: 'usp-3',
      title: 'Embedded in your real work',
      body: 'We build everything around live use-cases from your organisation; your tools, your processes, your clients. Onboarding tasks, checklists and learning modules map directly to real work.',
      image: ASSETS.usp3,
    },
    {
      id: 'usp-4',
      title: 'Seamless workflow integration',
      body: 'HiveMind fits around how your teams already work. We plug into your existing tools and rhythms, reducing context-switching and platform fatigue.',
      image: ASSETS.puzzle,
    },
  ],
  processSteps: [
    {
      step: 1,
      title: 'Step 1: Consultation & Discovery',
      body: 'We start by mapping your current world: how knowledge is stored, how people join and move roles, where onboarding breaks and where documentation lives.',
      image: ASSETS.consult,
      linkText: 'See Our Approach',
      linkUrl: '/services',
    },
    {
      step: 2,
      title: 'Step 2: Bespoke Course Creation',
      body: 'We co-design a tailored knowledge and onboarding architecture: role-specific journeys, centralised single source of truth documentation, and interactive training.',
      image: ASSETS.discuss,
      linkText: 'Learn More',
      linkUrl: '/services#industry',
    },
    {
      step: 3,
      title: 'Step 3: Implementation & Support',
      body: 'We pilot, iterate and embed. Together, we roll out your new onboarding and knowledge flows, measure time-to-productivity, and refine until the system feels natural.',
      image: ASSETS.delivery,
      linkText: 'Book Your Free Call',
      linkUrl: '/contact',
    },
  ],
  workingPrinciples: [
    {
      num: 1,
      title: 'Listen first',
      body: 'We spend time with your teams before we touch a single template. Through conversations and workshops, we listen for where people feel lost.',
      image: ASSETS.listenFirst,
    },
    {
      num: 2,
      title: 'Design with your reality in mind',
      body: 'We translate those insights into simple, practical changes: clearer journeys, better signposting, and personalized support.',
      image: ASSETS.designReality,
    },
    {
      num: 3,
      title: 'Embed and iterate',
      body: 'We roll things out in manageable pilots, build internal champions and watch how people really use the new flows.',
      image: ASSETS.embedIterate,
    },
  ],
  insights: [
    {
      tag: 'Data Analyst',
      title: 'Why Training a Good Data Analyst Takes Time',
      summary: 'Training a skilled data analyst takes time, requiring both technical mastery and industry-specific knowledge. Learn why customised training is essential for real business impact.',
      date: '2024-11-07',
      image: ASSETS.blog3,
    },
    {
      tag: 'Healthcare',
      title: 'Achieving Healthcare Efficiency with Data Training',
      summary: 'Discover how data training can transform healthcare efficiency by reducing costs, improving patient care, and empowering teams with predictive analytics.',
      date: '2024-11-01',
      image: ASSETS.blog1,
    },
  ],
} as const;
