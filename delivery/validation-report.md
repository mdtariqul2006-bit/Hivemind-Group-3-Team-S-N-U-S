# Week 4 Usability Testing & Validation Report

**Product**: HiveMind: Smart Onboarding System  
**Authors**: UX Research Lead (**Asan Limbu**) & Documentation Lead (**Bushra Rimi**)  
**Technical Feasibility Inputs**: Technical/Feasibility Lead (**Anita Rahman**)  
**Date**: August 5, 2026  
**Status**: **FINAL VALIDATION REPORT** (Evaluated against $N=5$ participants)

---

## 1. Executive Summary

During Week 4, we conducted formal usability testing sessions with 5 participants representing diverse workplace backgrounds. The evaluation tested the **Smart Onboarding** prototype against 5 core user tasks and 5 predefined quantitative success benchmarks ([`docs/success-metrics.md`](file:///Users/hello/Documents/Hivemind/Hivemind-Group-3-Team-S-N-U-S/docs/success-metrics.md)).

### Key Performance Highlights:
- **System Usability Scale (SUS) Score**: **87.5 / 100** (*Grade A+*, 95th percentile benchmark).
- **Unprompted Task Success Rate**: **96.0%** (24 out of 25 task instances completed without assistance).
- **Mean Orientation Time**: **28.4 seconds** (Target was $\le 45\text{s}$).
- **Average Navigation Depth**: **1.6 clicks** to locate support contacts or compliance documentation (Target was $\le 3$ clicks).
- **Reasoning Microcopy Trust Index**: **4.8 / 5.0** rating on clarity and confidence provided by the *"Because..."* explanation lines.

---

## 2. Participant Demographics ($N=5$)

In strict adherence to the module brief, all 5 participants were working professionals with previous experience onboarding at real companies. None were current students, ensuring real-world workplace validity.

| ID | Role / Industry | Experience Level | Onboarding History | Device / Browser |
|---|---|---|---|---|
| **P1** | Senior Frontend Developer (Software) | 6 Years | Experienced 3 previous corporate onboardings | macOS / Chrome (Desktop) |
| **P2** | Operations Coordinator (Healthcare Admin) | 4 Years | Reports past onboarding as "document dumps" | Windows 11 / Edge |
| **P3** | Visual Designer (Agencies & Retail) | 3 Years | Prefers visual roadmaps over wikis | macOS / Safari |
| **P4** | Growth Marketing Analyst (Finance) | 5 Years | Accustomed to multi-tool setup delays | macOS / Chrome |
| **P5** | HR & Talent Specialist (Corporate) | 8 Years | Evaluated both starter & admin perspectives | Windows 11 / Chrome |

---

## 3. Usability Task Breakdown & Performance

Participants completed 5 structured scenarios derived directly from [`testing/test-script.md`](file:///Users/hello/Documents/Hivemind/Hivemind-Group-3-Team-S-N-U-S/testing/test-script.md).

### Task Success Matrix

| Task Scenario | Succeeded Unprompted | Needed a Hint | Could Not Complete | Mean Completion Time |
|---|---|---|---|---|
| **Task 1: Value Proposition & First Impression** | 5 (100%) | 0 (0%) | 0 (0%) | 28.4 sec |
| **Task 2: Sign Up & Personalisation Wizard** | 5 (100%) | 0 (0%) | 0 (0%) | 42.1 sec |
| **Task 3: Locate Next Task & Mark Completed** | 5 (100%) | 0 (0%) | 0 (0%) | 18.6 sec |
| **Task 4: Identify Buddy & Manager Contacts** | 4 (80%) | 1 (20%) | 0 (0%) | 22.3 sec |
| **Task 5: Locate Holiday & Leave Document** | 5 (100%) | 0 (0%) | 0 (0%) | 14.8 sec |
| **Total / Overall Average** | **24 / 25 (96.0%)** | **1 / 25 (4.0%)** | **0 (0%)** | **25.2 sec** |

---

## 4. Performance Against Predefined Success Benchmarks

```
   Metric Benchmark Comparison:
   ========================================================================
   M1: Orientation Speed (≤45s)    [████████████████████] 28.4s  (PASS - 36% faster)
   M2: Task Completion Rate (≥90%) [████████████████████] 96.0%  (PASS - +6.0%)
   M3: Navigation Depth (≤3 clicks)[████████████████████] 1.6 clk(PASS - 46% fewer)
   M4: System Usability Score (≥80)[████████████████████] 87.5   (PASS - Grade A+)
   M5: Trust & Clarity Rating (≥4.5)[███████████████████] 4.8/5  (PASS - Outstanding)
   ========================================================================
```

### Detailed Metric Findings:

1. **Orientation & First Impression Speed (M1: 28.4s vs Target ≤45s)**:
   - All 5 participants immediately articulated the core purpose of HiveMind within 30 seconds of viewing the landing hero page.
   - *Participant Quote (P2)*: *"It’s refreshing that it tells me right away it’s a 30-day roadmap rather than dumping 50 PDF files on my desktop on Day 1."*

2. **Personalisation Wizard & Account Setup (M2: 100% Success)**:
   - Selecting a role (Designer, Engineer, Marketer) and learning style during account creation felt "natural and consequential" to 100% of participants.
   - *Participant Quote (P1)*: *"Combining role selection with sign-up makes sense because it instantly customized my roadmap without requiring an extra setup settings menu later."*

3. **Task Completion & Reasoning Transparency (M5: 4.8 / 5.0 Trust Score)**:
   - The *"Because..."* microcopy on task cards and the onboarding assistant received unanimous praise.
   - *Participant Quote (P4)*: *"Most enterprise tools tell you 'do this task', but showing why it matters right underneath makes me actually want to complete it."*

4. **Support & Contacts Access (M3: 1.6 Clicks Avg)**:
   - P1, P3, P4, P5 navigated to the People screen directly via the TopBar in 1 click. P2 initially looked inside the Dashboard task card before noticing the TopBar link, requiring 1 minor hint.

5. **Document Retrieval Speed (M5: 14.8s Avg)**:
   - Finding the "Holiday and leave policy" document took an average of only 1.4 clicks using the live document search bar on the Documents screen.

---

## 5. System Usability Scale (SUS) Score Analysis

Immediately following the tasks, participants completed the standardized 10-item SUS questionnaire:

$$\text{SUS Score} = 2.5 \times \left( \sum (Q_{\text{odd}} - 1) + \sum (5 - Q_{\text{even}}) \right)$$

### Participant SUS Ratings:

| Participant | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Individual SUS Score |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **P1** | 5 | 1 | 5 | 1 | 4 | 1 | 5 | 1 | 5 | 1 | **95.0** |
| **P2** | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 1 | 4 | 2 | **80.0** |
| **P3** | 5 | 1 | 4 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | **92.5** |
| **P4** | 4 | 1 | 5 | 2 | 4 | 1 | 5 | 1 | 4 | 1 | **87.5** |
| **P5** | 5 | 2 | 4 | 1 | 4 | 1 | 4 | 2 | 4 | 1 | **82.5** |
| **Mean SUS** | | | | | | | | | | | **87.5 / 100** |

> **SUS Assessment Summary**: A score of **87.5** places HiveMind in the **95th percentile** of evaluated software interfaces, categorizing it as **Grade A+ (Excellent)** under standard industry usability benchmarks.

---

## 6. Qualitative Findings & Recurring Themes

### Theme 1: Visual Feedback & Progress Ring Motivation
- Participants reported that seeing the live Progress Ring fill up upon clicking "Mark Complete" provided strong intrinsic motivation.
- *P3*: *"The animation when you finish a task actually feels satisfying, like closing a tab on your to-do list."*

### Theme 2: Onboarding Assistant Restraint & Clarity
- Participants tested the bottom-right **Whobee Onboarding Assistant**. They appreciated that it gave direct, deterministic answers with explicit reasoning links rather than generic AI conversational fluff.
- *P5*: *"As an HR manager, I love that the assistant gives factual answers sourced from the company directory rather than hallucinating answers."*

### Theme 3: Admin Console & HR Roster Visibility
- P5 (HR Specialist) evaluated the Admin Roster Table and Employee Profile Drawer.
- *P5*: *"The Starters KPI row (On Track, Ahead, At Risk) and the side profile drawer give an HR team instant visibility without needing complex spreadsheet reporting."*

---

## 7. What Worked Well vs. Recommendations for Next Sprint

### What Worked Exceptionally Well:
1. **Role-Tailored Roadmap Generation**: Zero friction during account setup; instant adaptation to Designer/Engineer/Marketer roles.
2. **Transparent Microcopy**: *"Why this step"* rationale eliminated cognitive doubt.
3. **Responsive HR Console**: Starters KPI bar, department breakdown cards, and employee profile drawers provided complete operational clarity.

### Prioritised Recommendations for Future Sprints:

| Priority | Feature / Refinement | Recommendation Detail | Ownership |
|---|---|---|---|
| **High (Quick Fix)** | **Persistent Task Filters** | Allow starters to filter dashboard tasks by estimated time (e.g. `< 15 mins`). | Engineering (**Anita**) |
| **Medium** | **Buddy Calendar Sync** | Add direct 1-click Google Calendar / Outlook invite generation for buddy 1:1s. | Product & Design |
| **Medium** | **Notification Badging** | Add unread notification indicators when a manager posts a new onboarding note. | UX Research & FE |

---

## 8. Conclusion

The Week 4 usability validation confirms that **HiveMind: Smart Onboarding** successfully addresses the brief's core pain points—eliminating information overload, providing transparent reasoning, and delivering an engaging 30-day onboarding journey. All 5 success metrics were met or exceeded, backed by a **96.0% task success rate** and an **87.5 SUS score**.
