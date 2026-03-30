---
paths:
  - docs/research/**
description: Rules for processing and formatting research content
---

# Research Content Processing

When the user provides links, raw text, or pasted article content for research:

1. **Fetch** all URLs for their content — combine with any raw pasted text
2. **Ignore** irrelevant information (ads, navigation, author bios, unrelated topics)
3. **Extract** only key actionable insights relevant to endurance sport training
4. **Identify** which existing file the content belongs in based on topic:
   - `swim.md` — swim training
   - `bike.md` — bike training
   - `run.md` — run training
   - `general-triathlon.md` — triathlon-specific topics
   - `nutrition.md` — nutrition
   - `recovery.md` — recovery
   - If a topic doesn't fit an existing file, create a new one (e.g. `periodisation.md`, `physiology.md`)
5. **Add** the new source to the Sources list at the top of the file
6. **Format** each insight as:
   - Key finding (2–3 sentences max, actionable and specific)
   - Specific numbers or protocols (if any are mentioned, always include them)
   - Applies to: Beginner / Intermediate / Elite / All
7. **Group** related insights under a clear `## Section Heading`
8. **Never** include vague general advice, never fabricate content, and note any conflicts with existing research already in the file
9. If a URL is behind a paywall or login wall, skip it silently — don't add placeholder notes
10. **All units must be metric** — convert any imperial measurements to: km, m, cm, mm, mL, L, kg, g. Never use miles, pounds, ounces, or feet
