import fs from "fs";

const srcPath = "C:/Users/peter/.claude/projects/C--Users-peter-OneDrive-Desktop-planmetric/53826f83-bf10-4a31-92fd-7be633c10f12/lulu-plan-v1.html";
let html = fs.readFileSync(srcPath, "utf-8");

// === 1. ADD DISCLAIMER after How To Use section ===
const disclaimerHtml = `<div class="disclaimer">
  <span class="material-symbols-outlined">info</span>
  <p>This training plan is provided as a general guide only and does not constitute medical advice, professional coaching, or a substitute for consultation with qualified healthcare or fitness professionals. Plan Metric and its creators are not qualified coaches, medical practitioners, or dietitians. You should consult your doctor before starting any new exercise program. By using this plan, you acknowledge that you do so entirely at your own risk. Plan Metric accepts no liability for injury, illness, or loss arising from the use of this plan.</p>
</div>`;

// Find the end of How To Use section and start of Overview section
const howToUseEnd = html.indexOf("</ul>\n</section>\n\n<section");
if (howToUseEnd === -1) {
  console.log("DEBUG: looking for How To Use end...");
  // Try alternate spacing
  const idx = html.indexOf("</ul>");
  const nearbyText = html.substring(idx, idx + 100);
  console.log("After first </ul>:", JSON.stringify(nearbyText));
}

// === 2. REPLACE WEEK OVERVIEW with Phase Breakdown ===
const phaseBreakdown = `  <h2>Your Training Phases</h2>
  <div class="phase-breakdown">
    <div class="phase-card">
      <div class="phase-card-header">
        <span class="material-symbols-outlined">foundation</span>
        <h3>Foundation Build <span class="phase-weeks">Weeks 1-4</span></h3>
      </div>
      <p>This phase establishes your aerobic base and running routine safely. You will build consistent mileage at easy effort, developing the cardiovascular and muscular foundation that every other phase depends on. Expect to feel comfortable and controlled — that is exactly the point. Patience here prevents injury and sets up bigger gains later.</p>
    </div>
    <div class="phase-card">
      <div class="phase-card-header">
        <span class="material-symbols-outlined">trending_up</span>
        <h3>Aerobic Development <span class="phase-weeks">Weeks 5-9</span></h3>
      </div>
      <p>Now your body is ready for more volume. This phase progressively increases your weekly distance while introducing tempo and threshold work. Your aerobic engine becomes more efficient, your long runs grow longer, and your body learns to burn fat as fuel. A recovery week in the middle ensures adaptation without burnout.</p>
    </div>
    <div class="phase-card">
      <div class="phase-card-header">
        <span class="material-symbols-outlined">fitness_center</span>
        <h3>Strength Endurance <span class="phase-weeks">Weeks 10-12</span></h3>
      </div>
      <p>This phase bridges aerobic fitness and race-specific speed. Hill repeats, longer tempo efforts, and sustained threshold runs build the muscular endurance needed to hold marathon pace when fatigue sets in. You will feel yourself getting stronger and more resilient with each session.</p>
    </div>
    <div class="phase-card">
      <div class="phase-card-header">
        <span class="material-symbols-outlined">speed</span>
        <h3>Marathon Specific <span class="phase-weeks">Weeks 13-14</span></h3>
      </div>
      <p>Everything narrows to marathon pace. Long runs now include extended sections at goal pace, teaching your body exactly what race day feels like. Intervals shift to race-relevant efforts. This is where confidence is built — you will prove to yourself that your target pace is sustainable.</p>
    </div>
    <div class="phase-card">
      <div class="phase-card-header">
        <span class="material-symbols-outlined">show_chart</span>
        <h3>Peak Volume <span class="phase-weeks">Week 15</span></h3>
      </div>
      <p>Your highest training load of the entire plan. This peak week pushes your fitness ceiling as high as possible before tapering begins. It is demanding by design — trust that the recovery ahead will transform this effort into race-day performance.</p>
    </div>
    <div class="phase-card">
      <div class="phase-card-header">
        <span class="material-symbols-outlined">self_improvement</span>
        <h3>Taper <span class="phase-weeks">Weeks 16-17</span></h3>
      </div>
      <p>Volume drops significantly while intensity stays sharp. Your body absorbs all the training from previous months, repairing muscles and topping off energy stores. You may feel restless or doubt your fitness — this is completely normal. Trust the process. You are getting faster by resting smarter.</p>
    </div>
    <div class="phase-card">
      <div class="phase-card-header">
        <span class="material-symbols-outlined">flag</span>
        <h3>Race Week <span class="phase-weeks">Week 18</span></h3>
      </div>
      <p>Minimal running with short shakeout jogs and strides to stay sharp. Focus shifts to logistics, nutrition prep, and mental readiness. Everything you have done in the last 17 weeks has led to this moment. You are ready.</p>
    </div>
  </div>`;

// Find and replace the overview section (between <section class="section"> with "18-Week Overview" and the closing </section> before phase-banner)
const overviewHeading = html.indexOf('<h2>18-Week Overview</h2>');
if (overviewHeading === -1) {
  console.error("Could not find 18-Week Overview heading");
  process.exit(1);
}
// Find the </section> that closes this overview
const overviewSectionEnd = html.indexOf("</section>", overviewHeading);

// Replace from the h2 to just before </section>
html = html.substring(0, overviewHeading) + phaseBreakdown + "\n" + html.substring(overviewSectionEnd);

// Insert disclaimer between How To Use section end and the new Training Phases section
// Find the section that contains "How To Use"
const howToUseIdx = html.indexOf("How To Use This Plan");
const sectionEndAfterHowTo = html.indexOf("</section>", howToUseIdx);
const insertPoint = sectionEndAfterHowTo + "</section>".length;
html = html.substring(0, insertPoint) + "\n\n" + disclaimerHtml + "\n" + html.substring(insertPoint);

// === 3. RACE DAY PROTOCOL — wrap sub-sections in <details> ===
// Pre-Race Timeline
html = html.replace(
  `<div class="protocol-section">\n    <h3>Pre-Race Timeline (Sunday, August 2, 2026)</h3>`,
  `<details class="protocol-section" open>\n    <summary>Pre-Race Timeline</summary>`
);

// Find the closing </div> for the first protocol-section and replace with </details>
// The pattern is: </div>\n  </div>\n\n  <div class="protocol-section">\n    <h3>Race Strategy
html = html.replace(
  `</div>\n  </div>\n\n  <div class="protocol-section">\n    <h3>Race Strategy</h3>`,
  `</div>\n  </details>\n\n  <details class="protocol-section">\n    <summary>Your Race Strategy</summary>`
);

html = html.replace(
  `</div>\n  </div>\n\n  <div class="protocol-section">\n    <h3>Mental Strategy</h3>`,
  `</div>\n  </details>\n\n  <details class="protocol-section">\n    <summary>Mental Strategy</summary>`
);

// Close the last protocol-section
html = html.replace(
  `</div>\n  </div>\n</section>\n\n<section class="glossary">`,
  `</div>\n  </details>\n</section>\n\n<section class="glossary">`
);

// === 4. COACH TIPS — replace emojis with Material Symbols ===
const emojiMap = [
  ["\u{1F3AF}", "track_changes"],    // 🎯
  ["\u{1F964}", "local_cafe"],       // 🥤
  ["\u{1F4AA}", "directions_run"],   // 💪
  ["\u{1F9E0}", "psychology"],       // 🧠
  ["\u26A1",    "bolt"],             // ⚡
  ["\u{1F389}", "celebration"],      // 🎉
  ["\u{1F3C3}\u200D\u2640\uFE0F", "health_and_safety"], // 🏃‍♀️
  ["\u{1F4C8}", "trending_up"],      // 📈
];
for (const [emoji, icon] of emojiMap) {
  html = html.replaceAll(
    `<div class="tip-icon">${emoji}</div>`,
    `<div class="tip-icon"><span class="material-symbols-outlined">${icon}</span></div>`
  );
}

// === 5. ADD CSS for new elements ===
const newCss = `
        /* Disclaimer */
        .disclaimer {
            max-width: 900px;
            margin: 1.5rem auto;
            padding: 1.25rem 1.5rem;
            background: rgba(160, 82, 45, 0.08);
            border: 1px solid rgba(160, 82, 45, 0.2);
            border-radius: 10px;
            display: flex;
            gap: 1rem;
            align-items: flex-start;
            font-size: 0.8rem;
            color: #6B5E54;
            line-height: 1.6;
        }
        .disclaimer .material-symbols-outlined {
            color: #A0522D;
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .disclaimer p {
            margin: 0;
        }

        /* Phase Breakdown */
        .phase-breakdown {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .phase-card {
            background: #F0E6D4;
            border-radius: 10px;
            padding: 1.25rem 1.5rem;
            border: 1px solid rgba(28,22,20,0.08);
        }
        .phase-card-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
        }
        .phase-card-header .material-symbols-outlined {
            color: #A0522D;
            font-size: 24px;
        }
        .phase-card-header h3 {
            font-size: 1.1rem;
            color: #1C1614;
            margin: 0;
        }
        .phase-weeks {
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            font-size: 0.85rem;
            color: #A0522D;
            margin-left: 0.5rem;
        }
        .phase-card p {
            font-size: 0.9rem;
            color: #3A2E28;
            line-height: 1.7;
            margin: 0;
        }

        /* Race Protocol Dropdowns */
        .race-protocol details.protocol-section {
            background: #E4DAC8;
            border: 1px solid rgba(28,22,20,0.08);
            border-radius: 10px;
            margin-bottom: 1rem;
            overflow: hidden;
        }
        .race-protocol summary {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            color: #A0522D;
            cursor: pointer;
            padding: 1rem 1.25rem;
            list-style: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .race-protocol summary::-webkit-details-marker {
            display: none;
        }
        .race-protocol summary::after {
            content: '+';
            font-size: 1.25rem;
            font-weight: 300;
            color: #A0522D;
            transition: transform 0.2s ease;
        }
        .race-protocol details[open] > summary::after {
            content: '\\2212';
        }
`;

html = html.replace("</style>", newCss + "\n        </style>");

// Write v2
const outPath = "C:/Users/peter/OneDrive/Desktop/planmetric/public/plans/custom/lulu-mathers-marathon-v2.html";
fs.writeFileSync(outPath, html, "utf-8");

// Verify
console.log("v2 written:", html.length, "chars");
console.log("1. Disclaimer:", html.includes("disclaimer") ? "YES" : "NO");
console.log("2. Phase breakdown:", html.includes("phase-breakdown") ? "YES" : "NO");
console.log("3. Details protocol:", html.includes('<details class="protocol-section">') ? "YES" : "NO");
console.log("4. Material icons in tips:", html.includes("track_changes") ? "YES" : "NO");
console.log("   No emojis left:", !html.includes("\u{1F3AF}") ? "YES" : "NO");
