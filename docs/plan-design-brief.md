# Plan Design Brief — Metric Athlete Starter Plans

This document defines the design language, structure, and coaching philosophy
for all Plan Metric Starter training plans. Use it as the reference when
generating new plans via the generation script or Claude API.

See the 5K Beginner plan (`public/plans/5k-beginner.html`) as the canonical
reference implementation.

## Key Design Tokens
- Background: #0a0f1a (deep navy)
- Cards: #111827
- Text: #f0f0f0 (primary), #c8ccd4 (secondary), #8891a0 (tertiary)
- Accent: #4fc3f7 (light blue)
- Borders: rgba(255,255,255,0.06)
- Fonts: Space Grotesk (headings/labels), Inter (body)
- Diamond markers before section labels
- Collapsible weeks via <details><summary>

## Tone
Authoritative, confident, evidence-backed, direct. No fluff.
"Shit, this plan is using all the right methods — I trust this."

## Coaching Principles
- 80/20 intensity distribution
- Progressive overload (max 10%/week, 5 min/session)
- Recovery week every 4th week at 50% volume
- Easy days genuinely easy (conversational)
- Sleep = highest-ROI recovery tool
- The long run is the anchor session
- Every session has a purpose

## Zone System (Starter — RPE only, no HR)
T1 Recovery (RPE 1-2), T2 Aerobic (3-4), T3 Tempo (5-6),
T4 VO2max (7-8), T5 Anaerobic (9-10)
