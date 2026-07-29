/**
 * HiveMind Academy Library Assets & Research Module
 * Centralizes downloaded images, SVGs, brand assets, and research content.
 */

export const ASSETS = {
  logo: '/library/images/logo-text-right.svg',
  iconLogo: '/library/images/ico-logo.svg',
  favicon: '/library/images/favicon.ico',
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
  /**
   * The mission and positioning statements, adapted from the HiveMind Academy
   * organisational report (July 2026), sections 1 and 2. Phrased to match the
   * house style, which keeps AI wording out of user facing copy.
   */
  mission: {
    statement:
      'Structure the way your organisation learns. Turn scattered knowledge and ad-hoc onboarding into a structured, guided learning system.',
    lead: 'Modern organisations lose time to scattered knowledge and ad-hoc onboarding.',
    body: 'HiveMind combines psychology-led consulting, bespoke learning journeys and a connected knowledge management system. Teams ramp up faster and share what they know, because knowledge becomes a living system rather than a folder nobody opens.',
    outcome: 'People perform with confidence from day one.',
    icon: 'target' as const,
    accent: 'honey' as const,
  },
  valuePropositions: [
    {
      id: 'usp-1',
      title: 'Role-specific, personalised journeys',
      body: 'We design learning and onboarding journeys around real roles, teams and workflows. Each path reflects your context, tools and priorities, so people learn exactly what they need to do their job well, from day one.',
      icon: 'users' as const,
      accent: 'honey' as const,
    },
    {
      id: 'usp-2',
      title: 'Context-Aware Guidance',
      body: 'Our platform surfaces the right documentation, guidance and next steps at the exact right moment, helping new starters find answers instantly without interrupting colleagues.',
      icon: 'sparkles' as const,
      accent: 'pink' as const,
    },
    {
      id: 'usp-3',
      title: 'Embedded in your real work',
      body: 'We build everything around live use-cases from your organisation; your tools, your processes, your clients. Onboarding tasks, checklists and learning modules map directly to real work.',
      icon: 'layers' as const,
      accent: 'sage' as const,
    },
    {
      id: 'usp-4',
      title: 'Seamless workflow integration',
      body: 'HiveMind fits around how your teams already work. We plug into your existing tools and rhythms, reducing context-switching and platform fatigue.',
      icon: 'puzzle' as const,
      accent: 'honey' as const,
    },
  ],
  processSteps: [
    {
      step: 1,
      title: 'Step 1: Consultation & Discovery',
      body: 'We start by mapping your current world: how knowledge is stored, how people join and move roles, where onboarding breaks and where documentation lives.',
      detail:
        'Through stakeholder interviews and systems reviews we surface the real pain behind knowledge silos, fragmented onboarding and compliance overload.',
      icon: 'search' as const,
      accent: 'honey' as const,
      linkText: 'See Our Approach',
      linkUrl: '/services',
    },
    {
      step: 2,
      title: 'Step 2: Bespoke Course Creation',
      body: 'We co-design a tailored knowledge and onboarding architecture: role-specific journeys, centralised single source of truth documentation, and interactive training.',
      detail:
        'Every element is psychologically informed and aligned to your culture, your processes and the systems your teams already use.',
      icon: 'penTool' as const,
      accent: 'pink' as const,
      linkText: 'Learn More',
      linkUrl: '/services#industry',
    },
    {
      step: 3,
      title: 'Step 3: Implementation & Support',
      body: 'We pilot, iterate and embed. Together, we roll out your new onboarding and knowledge flows, measure time-to-productivity, and refine until the system feels natural.',
      detail:
        'We track time-to-productivity, engagement and user feedback, then keep refining. We stay involved as you scale.',
      icon: 'rocket' as const,
      accent: 'sage' as const,
      linkText: 'Book Your Free Call',
      linkUrl: '/contact',
    },
  ],
  /**
   * How the team works with a client. The framing line matters: HiveMind does
   * not arrive with a pre-written playbook (report section 4).
   */
  workingStyle: {
    intro: 'We do not arrive with a pre-written playbook.',
    body: 'We start by understanding how your organisation actually runs: the pace, the pressures and the unwritten rules people navigate every day.',
  },
  workingPrinciples: [
    {
      num: 1,
      title: 'Listen first',
      body: 'We spend time with your teams before we touch a single template. Through conversations and workshops, we listen for where people feel lost.',
      detail: 'That shared understanding becomes the brief for everything that follows.',
      icon: 'ear' as const,
      accent: 'honey' as const,
    },
    {
      num: 2,
      title: 'Design with your reality in mind',
      body: 'We translate those insights into simple, practical changes: clearer journeys, better signposting, and personalized support.',
      detail: 'We prioritise whatever removes the most friction, in formats teams will actually adopt.',
      icon: 'pencilRuler' as const,
      accent: 'pink' as const,
    },
    {
      num: 3,
      title: 'Embed and iterate',
      body: 'We roll things out in manageable pilots, build internal champions and watch how people really use the new flows.',
      detail: 'Then we tune the language, the touchpoints and the automation rules together with you.',
      icon: 'refreshCw' as const,
      accent: 'sage' as const,
    },
  ],
  /**
   * Grounded in the actual "Christoph" pain points from the WBL brief
   * (cognitive overload, generic onboarding, black-box AI) rather than the
   * unrelated corporate-training blog posts these replaced.
   */
  insights: [
    {
      tag: 'Onboarding',
      title: 'Why the First 90 Days Decide Whether Someone Stays',
      summary: 'New hires who feel lost in their first weeks are far more likely to disengage or leave. A guided, role-specific path turns that critical window into confidence instead of overwhelm.',
      icon: 'bookOpen' as const,
      accent: 'honey' as const,
    },
    {
      tag: 'Knowledge Hub',
      title: 'Turning Tribal Knowledge Into a System People Actually Search',
      summary: 'The answers new hires need are usually already known, just trapped in someone else’s head. A living knowledge hub surfaces it before anyone has to ask.',
      icon: 'brainCircuit' as const,
      accent: 'sage' as const,
    },
    {
      tag: 'Trust & AI',
      title: 'Why "Because" Is the Most Important Word an AI Assistant Can Say',
      summary: 'People ignore recommendations they do not understand. Showing the reasoning behind every suggestion, not just the suggestion itself, is what makes an AI assistant worth trusting.',
      icon: 'shieldCheck' as const,
      accent: 'pink' as const,
    },
  ],
} as const;
