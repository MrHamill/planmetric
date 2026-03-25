# Design System Strategy: The Refined Athlete

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Gallery."** 

Unlike traditional fitness apps that rely on aggressive neon colors and high-contrast borders, this system treats performance data as fine art. We are building a space that feels like a high-end architectural studio or a luxury gallery—quiet, curated, and intentionally spaced—where the "athlete" is a person of discernment and discipline. 

The "template" look is avoided through **intentional asymmetry** and **tonal layering**. We break the rigid grid by allowing imagery to bleed off-edge and using typography scales that create a dramatic hierarchy. The interface doesn't scream for attention; it commands it through precision and breathing room.

## 2. Colors & Surface Philosophy
The palette is rooted in deep earth and mineral tones. It moves away from the "digital blue" of tech and toward the "organic charcoal" of high-performance gear.

*   **Primary (#D9C2B4):** Our "Sand/Gold" accent. Use this sparingly for high-intent actions and critical data highlights. It represents the human element against the technical background.
*   **Background (#0E0E0D):** A rich, near-black charcoal that provides a canvas for "Quiet Luxury."
*   **On-Surface (#E7E5E1):** A warm off-white. This reduces eye strain compared to pure white and adds a "paper-like" premium feel.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined solely through background color shifts. Use `surface-container-low` for large sections sitting on a `surface` background. This creates a seamless, sophisticated transition that feels integrated rather than boxed-in.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Surface (Base):** The foundation.
*   **Surface-Container-Low:** For secondary content blocks.
*   **Surface-Container-High:** For interactive cards or "lifted" modules.
*   **Glassmorphism:** Use for floating navigation or top-level overlays. Apply `surface` color at 60% opacity with a 20px backdrop blur to allow the richness of the background imagery to bleed through.

## 3. Typography: The Performance Scale
Our typography reflects a balance between technical precision and editorial elegance.

*   **Display & Headline (Epilogue):** This is our "Performance Geometric" voice. Use `display-lg` (3.5rem) for hero metrics (e.g., total distance). The geometric nature of Epilogue conveys authority and data-driven confidence.
*   **Title & Body (Manrope):** The workhorse. Manrope offers exceptional readability at smaller scales. Use `title-lg` for section headers to maintain a human-centric, approachable feel.
*   **Labels (Inter):** Reserved for technical metadata—specifically for **KM** and **Celsius** units. Inter’s neutral, "Swiss" aesthetic keeps technical data legible and professional.

**Metric-First Rule:** All data must be displayed in KM and Celsius. These units should use `label-md` in `primary` or `on-surface-variant` colors, positioned as a superscript or secondary element to the main metric value.

## 4. Elevation & Depth: Tonal Layering
In this design system, depth is not a shadow; it is a **state of light.**

*   **The Layering Principle:** Instead of traditional shadows, stack tiers. A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural "recessed" look.
*   **Ambient Shadows:** If a floating element (like a FAB or Menu) requires a shadow, use a tinted shadow: `rgba(14, 14, 13, 0.4)` with a blur of `32px` or higher. Never use pure black shadows; they feel "cheap" and digital.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` token at 15% opacity. It should be felt, not seen.

## 5. Components & Interaction Patterns

### Buttons
*   **Primary:** Filled with `primary` (#D9C2B4), text in `on-primary`. Use `roundedness-sm` (0.125rem) for a sharp, tailored look. Avoid "pill" shapes unless they are for chips.
*   **Secondary:** Ghost-style using a `surface-container-high` background. No border.
*   **Tertiary:** Text-only in `primary`, with a subtle underline appearing only on hover.

### Cards & Lists
*   **The Divider Forbid:** Never use lines to separate list items. Use the **Spacing Scale** (8 or 10) to create separation through white space. 
*   **Metric Cards:** Use `surface-container-low`. The metric value (e.g., 12.4 KM) should be the hero, using `display-sm`.

### Inputs
*   **Minimalist Fields:** Avoid boxed inputs. Use a subtle background fill of `surface-variant` and a 1px `primary` underline that animates from the center on focus.

### Additional Signature Components
*   **Metric Gauges:** Instead of circular rings, use "Linear Progress" bars with the `primary` color and a `primary-container` track. This feels more like a precision instrument.
*   **The "Insight" Module:** A full-bleed image with a `surface-container-highest` overlay at 80% opacity, used for personalized coaching or data summaries.

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Let a photo of a runner occupy 60% of the screen while text occupies the other 40% with heavy padding.
*   **Use the Spacing Scale:** Stick to the 0.7rem (Scale 2) or 1.4rem (Scale 4) increments to ensure the "Precise Alignment" vibe.
*   **Prioritize KM and Celsius:** Ensure these units are always visible but visually subordinate to the numerical value.

### Don't:
*   **Don't use "Tech" Gradients:** No purple-to-blue or neon transitions. If a gradient is needed, use a subtle transition from `primary` to `primary-dim`.
*   **Don't use 100% Opaque Borders:** This ruins the "Quiet Luxury" feel.
*   **Don't Overcrowd:** If a screen feels full, remove one element. This system thrives on the luxury of "wasted" space.