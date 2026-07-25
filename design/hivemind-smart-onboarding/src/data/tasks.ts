import type { RoleId, Task } from '@/types';

/**
 * Every new starter at Northwind gets these six steps. They are the "you are a
 * person here" half of onboarding, the half that usually goes missing.
 */
const SHARED_TASKS: Task[] = [
  {
    id: 'shared-hello',
    phase: 'day-1',
    title: 'Say hello to Priya',
    summary: 'Fifteen minutes with your buddy. No agenda, no prep, no laptop needed.',
    minutes: 15,
    icon: 'heart-handshake',
    why: 'People who meet their buddy on day one ask for help three times sooner than people who meet them in week two.',
    source: 'Northwind onboarding retro, March, the single most repeated request from new starters.',
    cards: [
      {
        kind: 'orient',
        title: 'Priya is not your manager',
        body: 'That is the point. She is a designer two years in, and her job for the next month is to be the person you can ask the questions that feel too small to ask anyone else.',
      },
      {
        kind: 'do',
        title: 'There is no wrong question',
        body: '"What does that acronym mean?" "Is this channel meant to be this quiet?" "Do people actually take lunch?" Priya has been asked all three. She was new once too.',
      },
      {
        kind: 'note',
        title: 'Book it before it slips',
        body: 'Fifteen minutes today beats an hour next Thursday. Her calendar is open and she has been told to expect you.',
      },
    ],
    checklist: [
      { id: 'c1', label: 'Send Priya a message' },
      { id: 'c2', label: 'Put fifteen minutes in the diary' },
    ],
    formats: {
      video: 'Priya recorded a 90-second hello so you know who to look for. Watch it before you message her.',
      reading: 'Priya wrote a short "things I wish I had known" note in the team wiki. Two minutes, worth it.',
      'hands-on': 'Skip the prep, just send her a message now. She will take it from there.',
    },
  },
  {
    id: 'shared-space',
    phase: 'day-1',
    title: 'Find your way around',
    summary: 'The kitchen, the quiet rooms, and the one door that needs a badge.',
    minutes: 10,
    icon: 'compass',
    why: 'You told us in your pre-start survey that you are in the London office three days a week, so this step is on your plan.',
    source: 'Northwind Workplace team, reviewed 14 days ago.',
    cards: [
      {
        kind: 'orient',
        title: 'The floor in one line',
        body: 'Design and Growth sit on the second floor south, Platform is north, and the good coffee is on the ground floor behind the plants, not the machine by the lifts.',
      },
      {
        kind: 'do',
        title: 'Quiet rooms are unbookable on purpose',
        body: 'The four small rooms on the second floor are first-come. If the door is shut, the person inside is on a call. If you need a guaranteed room, book Kestrel or Wren.',
      },
      {
        kind: 'note',
        title: 'Your badge opens more than you think',
        body: 'Second floor, the bike store, and the roof terrace. It does not open the server room, and nobody expects it to.',
      },
    ],
    checklist: [
      { id: 'c1', label: 'Test your badge on the second floor door' },
      { id: 'c2', label: 'Find the quiet rooms' },
      { id: 'c3', label: 'Find the good coffee' },
    ],
    formats: {
      video: 'There is a 2-minute walkthrough of the floor filmed on someone’s phone. It is not slick and it is very useful.',
      reading: 'The floor plan lives in the wiki with the room names marked. Screenshot it for your first week.',
      'hands-on': 'Just walk it. Ten minutes, whole floor, and you will not have to ask where anything is again.',
    },
  },
  {
    id: 'shared-rhythm',
    phase: 'week-1',
    title: 'How Northwind runs a week',
    summary: 'Which meetings matter, which are optional, and when it is fine to say no.',
    minutes: 20,
    icon: 'calendar-clock',
    why: 'New starters consistently tell us the calendar is the most confusing thing in week one, what is compulsory is never written down anywhere.',
    source: 'Northwind Ways of Working doc, owned by Sam Okonjo, updated this quarter.',
    cards: [
      {
        kind: 'orient',
        title: 'Three things are actually fixed',
        body: 'Monday kickoff at 09:30, your weekly 1:1 with Sam, and Thursday demo. Everything else on your calendar is a default invite you are allowed to decline.',
      },
      {
        kind: 'do',
        title: 'Thursday demo is not a performance',
        body: 'People show half-finished work constantly. Showing something rough in week one is a much better look than showing nothing polished in week four.',
      },
      {
        kind: 'do',
        title: 'Declining is normal here',
        body: 'If a meeting has no agenda and you are not named in it, decline with a one-line note. Nobody will think less of you. Several people will quietly copy you.',
      },
      {
        kind: 'note',
        title: 'Focus time is protected',
        body: 'Wednesday mornings are meeting-free company-wide. Guard yours from week one, it is much harder to claw back later.',
      },
    ],
    checklist: [
      { id: 'c1', label: 'Accept the three fixed meetings' },
      { id: 'c2', label: 'Decline one default invite' },
      { id: 'c3', label: 'Block Wednesday morning' },
    ],
    formats: {
      video: 'Sam recorded a 4-minute tour of a typical week, calendar on screen. Watch at 1.5×.',
      reading: 'The Ways of Working doc is six short sections. Read the first two now, the rest when you need them.',
      'hands-on': 'Open your calendar and actually edit it while you read this. Decline one thing before you close the tab.',
    },
  },
  {
    id: 'shared-people',
    phase: 'week-1',
    title: 'Work out who does what',
    summary: 'The eight people you will need in your first month, and what each is for.',
    minutes: 15,
    icon: 'users',
    why: 'You said "I never knew who to ask" was your worst experience of starting a job. This step exists because of that answer.',
    source: 'Your pre-start survey, plus the Northwind team directory.',
    cards: [
      {
        kind: 'orient',
        title: 'Start with four, not forty',
        body: 'Priya for anything small. Sam for anything about you. Dev for anything that is broken. #ask-northwind for everything else. That covers your first month.',
      },
      {
        kind: 'do',
        title: 'Ask in public where you can',
        body: 'A question in #ask-northwind gets answered once and helps the next person. The same question in a DM gets answered once and disappears.',
      },
      {
        kind: 'note',
        title: 'Nobody is keeping score',
        body: 'There is no threshold where asking becomes embarrassing. The people who ask most in month one are usually the ones running things by year two.',
      },
    ],
    checklist: [
      { id: 'c1', label: 'Join #ask-northwind' },
      { id: 'c2', label: 'Ask one question in public' },
    ],
    formats: {
      video: 'A short screen recording of someone actually asking in #ask-northwind and getting an answer in four minutes.',
      reading: 'The team directory has a "what to ask me about" line on every profile. Skim your team and star four people.',
      'hands-on': 'Post the question you have been sitting on. Right now, before you finish this card.',
    },
  },
  {
    id: 'shared-checkin',
    phase: 'month-1',
    title: 'Your 30-day check-in with Sam',
    summary: 'A proper conversation about how it is going, both directions.',
    minutes: 45,
    icon: 'message-circle',
    why: 'This is scheduled rather than optional because the people who most need the conversation are the least likely to ask for it.',
    source: 'Northwind manager playbook, every new starter gets one at 30 days.',
    cards: [
      {
        kind: 'orient',
        title: 'This is not a performance review',
        body: 'Nothing is being assessed. Sam wants to know what is working, what is still confusing, and whether the job matches what you were told in the interview.',
      },
      {
        kind: 'do',
        title: 'Bring one thing that is not working',
        body: 'Every new starter has one. A tool that is slow, a meeting that is pointless, a doc that is wrong. Saying it at 30 days is a gift, at six months it just sounds like a complaint.',
      },
      {
        kind: 'do',
        title: 'Ask what good looks like at 90 days',
        body: 'It is the single most useful question you can ask, and most people never ask it. Get it in writing afterwards.',
      },
    ],
    checklist: [
      { id: 'c1', label: 'Write down one thing that is not working' },
      { id: 'c2', label: 'Write down two things that are' },
      { id: 'c3', label: 'Ask what good looks like at 90 days' },
    ],
    formats: {
      video: 'Sam recorded what he is hoping to get out of the conversation, so it is not a surprise.',
      reading: 'There is a one-page prompt sheet in the wiki. Fill it in the night before, not in the meeting.',
      'hands-on': 'Draft your three points straight into the shared doc. Sam will see them beforehand and that is fine.',
    },
  },
  {
    id: 'shared-feedback',
    phase: 'month-1',
    title: 'Tell us how onboarding felt',
    summary: 'Five minutes, while you still remember what was confusing.',
    minutes: 5,
    icon: 'sparkles',
    why: 'You are the last person who will ever see this process with fresh eyes. In two months you will have forgotten what was hard.',
    source: 'Northwind People team, every answer is read, and the last round changed four of these steps.',
    cards: [
      {
        kind: 'orient',
        title: 'Be specific, not kind',
        body: '"It was fine" helps nobody. "The badge step said second floor but my badge only worked on the third" changes the actual step for the next person.',
      },
      {
        kind: 'note',
        title: 'This is anonymous by default',
        body: 'Sam sees themes, not names. If you want something attributed to you so it can be acted on directly, there is a tickbox.',
      },
      {
        kind: 'do',
        title: 'Name the step that wasted your time',
        body: 'There is always one. Naming it is the most useful thing you will do for the next person who joins.',
      },
    ],
    checklist: [{ id: 'c1', label: 'Answer the five questions' }],
    formats: {
      video: 'Skip the video on this one, it is a five-minute form, just open it.',
      reading: 'The last round of feedback and what changed because of it is published in the wiki. Worth two minutes first.',
      'hands-on': 'Open the form and answer question one now. The rest takes four minutes.',
    },
  },
];

/**
 * The role-specific half. A designer, an engineer and a marketer genuinely do not
 * need the same first week, and this is where that shows.
 */
const ROLE_TASKS: Record<RoleId, Task[]> = {
  designer: [
    {
      id: 'designer-tools',
      phase: 'day-1',
      title: 'Set up Figma and the design system',
      summary: 'Access, libraries, and the file naming that keeps everyone sane.',
      minutes: 30,
      icon: 'palette',
      why: 'You are shown this instead of the engineering setup step because you picked Designer. An engineer sees repo access here.',
      source: 'Northwind Design guild, the system library was last published 3 days ago.',
      cards: [
        {
          kind: 'orient',
          title: 'Two libraries, not eleven',
          body: 'Northwind Core has the components. Northwind Brand has the type, colour and logo. Everything else you will find in Figma is somebody’s abandoned experiment, ignore it.',
        },
        {
          kind: 'do',
          title: 'Turn on Core before you draw anything',
          body: 'Assets panel, Libraries, enable "Northwind Core". Ninety per cent of what you are about to build already exists in it.',
        },
        {
          kind: 'do',
          title: 'File names are load-bearing',
          body: 'Pattern is area-surface-vN, lowercase, hyphens. So checkout-payment-v2, not "Checkout FINAL (Alex)". People search these constantly and the search is not clever.',
        },
        {
          kind: 'note',
          title: 'Detach is not a crime',
          body: 'If a component nearly works, detach it and make your case in critique. The library grows from people detaching things and saying why.',
        },
      ],
      checklist: [
        { id: 'c1', label: 'Confirm Figma access' },
        { id: 'c2', label: 'Enable both Northwind libraries' },
        { id: 'c3', label: 'Rename your first file to the pattern' },
      ],
      formats: {
        video: 'A 6-minute screen recording walking through library setup and one real component. Follow along rather than watching first.',
        reading: 'The design system has a written getting-started page. The "when to detach" section is the part worth your time.',
        'hands-on': 'Open the sandbox file, rebuild the settings row using only Core components, and see what is missing.',
      },
    },
    {
      id: 'designer-critique',
      phase: 'week-1',
      title: 'Take something to critique',
      summary: 'Anything. Rough is the point. Thursday, 14:00.',
      minutes: 60,
      icon: 'eye',
      why: 'Designers who present in week one report feeling settled roughly two weeks earlier than those who wait for something polished.',
      source: 'Design guild retro notes, plus Priya’s strong personal opinion.',
      cards: [
        {
          kind: 'orient',
          title: 'Critique here is not approval',
          body: 'Nobody signs anything off in the room. It is eight people helping you find the problem faster than you would have found it alone.',
        },
        {
          kind: 'do',
          title: 'Open with the question, not the work',
          body: '"I am stuck on how someone gets back out of this flow" gets you a useful hour. "Here is my design" gets you forty minutes of opinions about the button colour.',
        },
        {
          kind: 'do',
          title: 'Rough beats polished',
          body: 'Polished work gets polite feedback because it looks decided. Bring the version with the grey boxes still in it.',
        },
        {
          kind: 'note',
          title: 'You are allowed to disagree',
          body: 'Out loud, in the room, with the person who said it. That is genuinely how it works here and it takes most people a month to believe.',
        },
      ],
      checklist: [
        { id: 'c1', label: 'Add yourself to Thursday’s agenda' },
        { id: 'c2', label: 'Write your one question at the top of the file' },
        { id: 'c3', label: 'Present it' },
      ],
      formats: {
        video: 'Watch last Thursday’s recording at 1.5×, mostly to see how unfinished people’s work actually is.',
        reading: 'The critique format is one page in the guild wiki. The "how to receive feedback" half is the useful half.',
        'hands-on': 'Put your name on the agenda before you read anything else. The deadline will do the rest.',
      },
    },
    {
      id: 'designer-own',
      phase: 'month-1',
      title: 'Own a surface end to end',
      summary: 'One real screen, from problem to shipped, with your name on it.',
      minutes: 90,
      icon: 'layout-dashboard',
      why: 'This is the step where you stop being onboarded and start being a designer here. It is sequenced last on purpose.',
      source: 'Agreed between you and Sam in your week-2 1:1.',
      cards: [
        {
          kind: 'orient',
          title: 'Small and real beats big and hypothetical',
          body: 'The empty state of the reports page is a genuinely good first surface. It is small, it is visible, and it is currently bad.',
        },
        {
          kind: 'do',
          title: 'Write the problem before you open Figma',
          body: 'Three sentences in the ticket: who hits this, what they expected, what they got. If you cannot write it, you do not understand it yet.',
        },
        {
          kind: 'do',
          title: 'Pair with the engineer early',
          body: 'Dev will tell you in ten minutes which of your three ideas is a week of work and which is an afternoon. That conversation is worth more than another day in Figma.',
        },
        {
          kind: 'note',
          title: 'Ship it, then watch it',
          body: 'Ask Growth to put it in the weekly numbers. Seeing your own work move a number is the fastest way to stop feeling new.',
        },
      ],
      checklist: [
        { id: 'c1', label: 'Write the problem statement' },
        { id: 'c2', label: 'Pair with Dev on feasibility' },
        { id: 'c3', label: 'Take it to critique' },
        { id: 'c4', label: 'Ship it' },
      ],
      formats: {
        video: 'Two recorded case-study walkthroughs from the guild, both showing the messy middle rather than the final screens.',
        reading: 'Read the two most recent shipped-surface write-ups in the wiki. Note how short they are.',
        'hands-on': 'Claim the reports empty state ticket today and write the problem statement into it.',
      },
    },
  ],
  engineer: [
    {
      id: 'engineer-tools',
      phase: 'day-1',
      title: 'Clone the repo and get it running',
      summary: 'One command, one env file, and the thing that always breaks.',
      minutes: 45,
      icon: 'terminal',
      why: 'You are shown this instead of the Figma setup step because you picked Engineer. A designer sees design-system access here.',
      source: 'northwind/platform README, verified against a clean machine last Tuesday.',
      cards: [
        {
          kind: 'orient',
          title: 'One repo, not seven',
          body: 'northwind/platform is the monorepo and it is the only one you need this month. The other repos in the org are archived or infrastructure.',
        },
        {
          kind: 'do',
          title: 'The setup script does everything',
          body: 'pnpm install && pnpm setup. It provisions the local database, seeds it, and writes your .env. Do not hand-assemble the env file. That is how people lose an afternoon.',
        },
        {
          kind: 'note',
          title: 'The thing that always breaks',
          body: 'If the seed step hangs, it is Docker not being awake yet. Start Docker, rerun pnpm setup. This has caught every single new engineer, including the person who wrote the script.',
        },
        {
          kind: 'do',
          title: 'Prove it works',
          body: 'pnpm dev, open localhost:3000, log in as the seeded account. If you see the dashboard, you are done and the rest of today is yours.',
        },
      ],
      checklist: [
        { id: 'c1', label: 'Confirm GitHub org access' },
        { id: 'c2', label: 'Run pnpm setup' },
        { id: 'c3', label: 'See the dashboard on localhost' },
      ],
      formats: {
        video: 'A 9-minute recording of a genuinely clean machine going from zero to running, including the Docker mistake.',
        reading: 'The README is accurate and short. The troubleshooting section at the bottom is the part to bookmark.',
        'hands-on': 'Skip the README and just run the script. Come back to the troubleshooting section only if it stops.',
      },
    },
    {
      id: 'engineer-pr',
      phase: 'week-1',
      title: 'Ship your first pull request',
      summary: 'Something tiny and real, merged to main, in your first week.',
      minutes: 90,
      icon: 'git-pull-request',
      why: 'Engineers who merge in week one are measurably more confident at 30 days. The task is small deliberately, the point is the pipeline, not the code.',
      source: 'Platform team onboarding metrics, last 18 months.',
      cards: [
        {
          kind: 'orient',
          title: 'There is a queue of good first issues',
          body: 'Labelled good-first-issue and kept genuinely stocked. Take the one about the misaligned empty state, it touches the component library, CI and the deploy, which is the whole tour.',
        },
        {
          kind: 'do',
          title: 'Branch naming is enforced by CI',
          body: 'type/short-description, so fix/empty-state-alignment. CI rejects anything else and it is not being difficult, it drives the changelog.',
        },
        {
          kind: 'do',
          title: 'Small PRs get reviewed fast',
          body: 'Under 200 lines usually gets a review inside two hours. Over 600 lines sits for a day and comes back with vague comments. This is true everywhere and very true here.',
        },
        {
          kind: 'note',
          title: 'Review comments are not criticism',
          body: 'Dev leaves a lot of them and they are almost all context you could not have had. If one reads as harsh, it was typed quickly, not felt strongly.',
        },
      ],
      checklist: [
        { id: 'c1', label: 'Claim a good-first-issue' },
        { id: 'c2', label: 'Open the PR' },
        { id: 'c3', label: 'Get it merged' },
      ],
      formats: {
        video: 'A screen recording of a real first PR from branch to merge, review comments and all.',
        reading: 'The contributing guide covers branch naming, the CI gates and the deploy. Ten minutes, read it once.',
        'hands-on': 'Claim the issue now. You will learn the pipeline faster by hitting the CI failures than by reading about them.',
      },
    },
    {
      id: 'engineer-oncall',
      phase: 'month-1',
      title: 'Shadow an on-call rotation',
      summary: 'A week riding along with Dev. No pager, no responsibility.',
      minutes: 120,
      icon: 'shield-check',
      why: 'You will not be on the rota for six months. Shadowing now is how the system stops being a mystery long before it is your problem.',
      source: 'Platform on-call handbook, shadowing is standard at 30 days.',
      cards: [
        {
          kind: 'orient',
          title: 'You carry nothing',
          body: 'Dev holds the pager. You sit in the incident channel, watch what happens, and ask why afterwards. That is the entire commitment.',
        },
        {
          kind: 'do',
          title: 'Read one old postmortem first',
          body: 'The March checkout incident is the best one, it is well written, blameless, and shows how much of an incident is people coordinating rather than code.',
        },
        {
          kind: 'do',
          title: 'Ask "how did you know to look there?"',
          body: 'The single highest-value question during an incident. The answer is usually a piece of system knowledge that is not written down anywhere, and now you have it.',
        },
        {
          kind: 'note',
          title: 'Quiet weeks are normal',
          body: 'Most shadow weeks have no incident at all. That is not a wasted week, you will still see the daily checks and the handover, which is most of the job.',
        },
      ],
      checklist: [
        { id: 'c1', label: 'Read the March postmortem' },
        { id: 'c2', label: 'Join the incident channel' },
        { id: 'c3', label: 'Sit in on one handover' },
      ],
      formats: {
        video: 'The recorded incident review from March, 25 minutes. Watch it before your shadow week, not during.',
        reading: 'The on-call handbook plus one postmortem. The handbook is dry; the postmortem is the one that teaches you something.',
        'hands-on': 'Join the incident channel today and lurk. Two weeks of reading it in the background beats any document.',
      },
    },
  ],
  marketer: [
    {
      id: 'marketer-tools',
      phase: 'day-1',
      title: 'Learn the voice, get into the tools',
      summary: 'How Northwind sounds, and the four tools where that voice gets used.',
      minutes: 30,
      icon: 'megaphone',
      why: 'You are shown this instead of the engineering setup step because you picked Marketer. An engineer sees repo access here.',
      source: 'Northwind brand voice guide, rewritten in January, and genuinely used.',
      cards: [
        {
          kind: 'orient',
          title: 'The voice in one line',
          body: 'Warm, specific, and never breathless. We say "this saves you about an hour a week" rather than "revolutionise your workflow". If a sentence would embarrass you out loud, cut it.',
        },
        {
          kind: 'do',
          title: 'Four tools, that is all',
          body: 'HubSpot for lifecycle, Figma for assets, the shared calendar for anything dated, and #growth for decisions. Anything agreed in a DM did not happen.',
        },
        {
          kind: 'do',
          title: 'Steal from the archive',
          body: 'The last twelve campaigns are all in the calendar with their numbers attached. Read the three that did well and the two that did not, the failures are more instructive.',
        },
        {
          kind: 'note',
          title: 'Legal is fast if you ask early',
          body: 'Rana turns claims review around in under a day when asked on Monday, and not at all when asked on Friday afternoon.',
        },
      ],
      checklist: [
        { id: 'c1', label: 'Read the voice guide' },
        { id: 'c2', label: 'Get into HubSpot and the calendar' },
        { id: 'c3', label: 'Read two past campaigns' },
      ],
      formats: {
        video: 'A 5-minute voice teardown, the same email written badly, then written properly, side by side.',
        reading: 'The voice guide is four pages with real before-and-after examples. This is the one doc worth reading properly.',
        'hands-on': 'Rewrite last month’s worst-performing email in the Northwind voice. Nobody will see it; you will learn the voice in twenty minutes.',
      },
    },
    {
      id: 'marketer-brief',
      phase: 'week-1',
      title: 'Write your first campaign brief',
      summary: 'One page, one audience, one number you are trying to move.',
      minutes: 60,
      icon: 'pen-tool',
      why: 'Writing the brief is how you learn what Northwind actually sells, faster than any amount of reading about it.',
      source: 'Growth team brief template, the one-page version, not the old six-page one.',
      cards: [
        {
          kind: 'orient',
          title: 'One page, hard limit',
          body: 'Audience, insight, the one number, the channels, what we are not doing. If it runs to two pages, the thinking is not finished.',
        },
        {
          kind: 'do',
          title: 'Name what you are not doing',
          body: 'The most useful line in any brief here. "Not touching existing customers, not running paid" saves three arguments later in the week.',
        },
        {
          kind: 'do',
          title: 'Pick a number you can actually see',
          body: 'Trial starts from the pricing page, good, it is on the dashboard. "Brand awareness", not a number, and you will not be able to tell whether it worked.',
        },
        {
          kind: 'note',
          title: 'Show it half-finished',
          body: 'Take it to #growth when it is 60% done. A ten-minute reaction beats a day of solo polishing on something nobody has agreed with yet.',
        },
      ],
      checklist: [
        { id: 'c1', label: 'Copy the one-page template' },
        { id: 'c2', label: 'Pick one measurable number' },
        { id: 'c3', label: 'Share it in #growth at 60%' },
      ],
      formats: {
        video: 'A 7-minute walkthrough of a real brief from blank page to shared, thinking out loud.',
        reading: 'The template plus the two best briefs from last quarter. Notice that both are shorter than you expect.',
        'hands-on': 'Open the template and fill in the audience line now. The rest gets easier once that one is written.',
      },
    },
    {
      id: 'marketer-launch',
      phase: 'month-1',
      title: 'Run a launch moment end to end',
      summary: 'A small feature launch, yours from brief to numbers.',
      minutes: 120,
      icon: 'rocket',
      why: 'This is the step where you stop shadowing and start owning. It is sequenced last on purpose.',
      source: 'Agreed between you and Sam in your week-2 1:1.',
      cards: [
        {
          kind: 'orient',
          title: 'Small launch, whole cycle',
          body: 'The saved-views feature ships in three weeks. It is small enough to own alone and real enough that the numbers will mean something.',
        },
        {
          kind: 'do',
          title: 'Talk to the engineer before you write anything',
          body: 'Fifteen minutes with Dev will get you the one sentence that explains what the feature actually does. Every launch that skips this step describes the wrong thing.',
        },
        {
          kind: 'do',
          title: 'Write the changelog entry first',
          body: 'If you cannot explain it in three sentences to an existing customer, the email and the social posts will not save you. Write that first, expand outwards.',
        },
        {
          kind: 'note',
          title: 'Book the retro before you launch',
          body: 'Put thirty minutes in the calendar for two days after. Retros that are not pre-booked do not happen, and the launch you learn nothing from is a wasted launch.',
        },
      ],
      checklist: [
        { id: 'c1', label: 'Talk to Dev about what it does' },
        { id: 'c2', label: 'Write the changelog entry' },
        { id: 'c3', label: 'Book the retro' },
        { id: 'c4', label: 'Ship the launch' },
      ],
      formats: {
        video: 'Two recorded launch retros, including the one where the email went out with the wrong date.',
        reading: 'The launch checklist plus last quarter’s retro notes. The retro notes are where the real lessons are.',
        'hands-on': 'Claim the saved-views launch today and get fifteen minutes with Dev in the diary.',
      },
    },
  ],
};

export function tasksForRole(role: RoleId): Task[] {
  const all = [...SHARED_TASKS, ...ROLE_TASKS[role]];
  const order = { 'day-1': 0, 'week-1': 1, 'month-1': 2 } as const;
  // Role-specific work leads each phase, it is the reason the plan feels personal.
  return all.sort((a, b) => {
    const byPhase = order[a.phase] - order[b.phase];
    if (byPhase !== 0) return byPhase;
    const aRole = a.id.startsWith('shared') ? 1 : 0;
    const bRole = b.id.startsWith('shared') ? 1 : 0;
    return aRole - bRole;
  });
}
