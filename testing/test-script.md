# Usability test script

For Week 4 validation. Run this with 3 to 5 people who have workplace experience,
ideally people who are not students, someone who has actually started a job
before and knows what a bad first week feels like. About 20 to 25 minutes per
session.

Owned by the UX Research Lead (Asan Limbu).

## What you need before a session

- A laptop with the prototype running (`npm run dev` from the repo root, or a
  deployed link if one exists) at a comfortable screen size.
- This script, printed or on a second screen so you are not reading off the
  same screen the participant is using.
- A blank copy of `testing/participant-notes/TEMPLATE.md`, renamed following
  the `GroupName_StudentName_PXX_YYYY-MM-DD_UsabilityTest.md` convention (see
  `testing/participant-notes/README.md`).
- A way to note timestamps: a phone timer or a stopwatch app is enough.

## Before you start: consent and anonymisation

Tell the participant, in your own words:

> This is a usability test for a student project, not a real HiveMind product.
> I will ask you to try a few tasks in a prototype and think out loud while you
> do them. There are no wrong answers, if something is confusing that is
> useful information for us, not a mistake on your part. I will take notes on
> what you do and say. I will not record your name, only a participant number,
> and nothing you say will be shared outside the team and our assessment.
> You can stop at any point. Is that OK to continue?

Only proceed once they say yes. In your notes, use a participant ID (P1, P2,
P3...), never a name, matching the convention already used in
`research/transcripts/`.

## Context to read aloud

> Imagine HiveMind is a real company you have just joined. Your name is
> Christoph. Today is your first day. You have just been sent a link to log
> into HiveMind's onboarding tool for the first time. I am going to ask you to
> do a few things in it as if this were actually your first day.

## Tasks

Each task maps to one of the success metrics already defined in
`docs/success-metrics.md`. Note the time taken, whether they succeeded
unprompted, needed a hint, or could not complete it, and anything they say
out loud.

### Task 1: First impressions (tests: value clarity within the first minute)

Show the landing page only, do not let them scroll or click yet.

> Look at this page for about 30 seconds. Don't click anything yet. What do
> you think this is, and who is it for?

Ask afterwards: "What would you expect to happen if you clicked [the main
button]?" before they actually click it.

### Task 2: Create an account and set yourself up

> Set yourself up as a new starter. Use any email, it doesn't need to be real.

Watch whether they find Sign Up, understand picking a team (Designer,
Engineer, Marketer) as part of setting up their account, and reach their own
dashboard without help. Note if they expected role selection to be a separate
step, or found it a natural part of signing up.

### Task 3: Find out what to do first (tests: understanding the next step within a minute, finding info in a few clicks)

> You're on your dashboard now. Find out what you're supposed to do first,
> and mark it as done.

Count clicks to find the current task, and clicks to complete it. Note if
they understood why that particular task was shown to them (the "why this
task" explanation on the task detail screen).

### Task 4: Find who to ask for help (tests: identifying who to ask)

> You have a question about something at work and you don't know who to ask.
> Find out who your buddy or your manager is, and how you'd reach them.

### Task 5 (if time allows): Find a specific document

> You want to know how many holiday days you get and how to book them off.
> Find the document that would tell you that.

(This is the "Holiday and leave policy" document. If the document list has
changed by the time you run this, swap in whichever policy document is
closest to this in content.)

## Closing questions

Ask these after all tasks, while it's fresh:

1. On a scale of 1 to 5, how confident would you feel about your first week
   if this were your real onboarding tool? Why that number?
2. What was the most confusing moment, if any?
3. What was the most useful or reassuring moment, if any?
4. Was there anything you expected to be able to do but couldn't find?
5. If you could change one thing, what would it be?

## Right after the session

Fill in your copy of `testing/participant-notes/TEMPLATE.md` while it's
fresh, do not wait until the end of the day. Then add a one line summary to
your own working notes so patterns across participants are easy to spot once
all sessions are done.
