const fs=require('fs');
const ORIG='C:/Users/peter/OneDrive/Desktop/planmetric/public/plans/custom/pete-hamill-703.html';
const OUT=ORIG;
const o=fs.readFileSync(ORIG,'utf8');

function D(w,t=24){let r='';for(let i=1;i<=t;i++){if(i<w)r+='<span class="dot filled"></span>';else if(i===w)r+='<span class="dot current"></span>';else r+='<span class="dot"></span>';}return r;}
function WI(w,t=24,x=''){let l=`Week ${w} of ${t}`;if(x)l+=` &mdash; ${x}`;return `<span class="week-indicator">${l}</span>`;}

// Extract style block
const se=o.indexOf('</style>')+'</style>'.length;
const styles=o.substring(0,se);

// Extract sections from original by line-based approach
const lines=o.split('\n');

// Find line ranges for original weeks
function findWeekLines(wNum){
  const startComment=`<!-- WEEK ${wNum} -->`;
  let startIdx=-1,endIdx=-1;
  for(let i=0;i<lines.length;i++){
    if(lines[i].includes(startComment)&&startIdx===-1)startIdx=i;
    if(startIdx!==-1&&i>startIdx&&lines[i].includes('</details>')&&lines[i+1]&&lines[i+1].includes('</section>')){
      endIdx=i+1;break;
    }
  }
  return [startIdx,endIdx];
}

// Extract a week's HTML and update dots/indicator
function getWeek(oldNum,newNum,newTitle){
  const[s,e]=findWeekLines(oldNum);
  if(s===-1)return `<!-- WEEK ${oldNum} NOT FOUND -->\n`;
  let block=lines.slice(s,e+1).join('\n');

  // Update section id
  block=block.replace(`id="week-${oldNum}"`,`id="week-${newNum}"`);
  // Update data-week
  block=block.replace(`data-week="${oldNum}"`,`data-week="${newNum}"`);
  // Update week comment
  block=block.replace(`<!-- WEEK ${oldNum} -->`,`<!-- WEEK ${newNum} -->`);

  // Update summary text if new title provided
  if(newTitle){
    block=block.replace(/(<summary><span>)Week \d+ &mdash; [^<]+/,`$1Week ${newNum} &mdash; ${newTitle}`);
  }else{
    block=block.replace(/(<summary><span>)Week \d+/,`$1Week ${newNum}`);
  }

  // Replace progress dots
  const dotsRe=/<div class="progress-dots">[\s\S]*?<\/div>/;
  block=block.replace(dotsRe,`<div class="progress-dots">\n      ${D(newNum)}\n      ${WI(newNum)}\n    </div>`);

  // Replace "X of 16" references in text
  block=block.replace(/of 16/g,'of 24');
  // Replace "16 weeks" references
  block=block.replace(/next 16 weeks/g,'next 24 weeks');
  block=block.replace(/16 weeks of training/g,'24 weeks of training');
  // Replace "in 16 weeks" references
  block=block.replace(/in 16 weeks/g,'in 24 weeks');

  return block;
}

// Helper for Saturday cards
const saturday = '<div class="day-card rest"><div class="day-header"><span class="day-label">Saturday</span><span class="day-session">Soccer Game + Recovery</span><div class="day-badges"><span class="badge badge-rest">REST</span><span class="badge badge-accent">Soccer</span></div></div>\n    <p class="day-structure">Soccer game day. No triathlon training. Refuel, hydrate, stretch, early bed.</p></div>';

const saturdayShort = '<div class="day-card rest"><div class="day-header"><span class="day-label">Saturday</span><span class="day-session">Soccer Game + Recovery</span><div class="day-badges"><span class="badge badge-rest">REST</span><span class="badge badge-accent">Soccer</span></div></div>\n    <p class="day-structure">Soccer game. Refuel, hydrate, early bed.</p></div>';

// Now build sections
let h='';

// 1) Styles
h+=styles+'\n';

// 2) Body through training zones - read from part2 file
h+=fs.readFileSync('C:/Users/peter/OneDrive/Desktop/planmetric/plan_part2.html','utf8')+'\n';

// ============= BASE PHASE (Weeks 1-8) =============
h+=`
<!-- ======================================= BASE PHASE ======================================= -->
<div class="phase-banner"><span class="phase-name">Base Phase</span><span class="phase-desc">&mdash; Weeks 1&ndash;8 &mdash; Build swim competence, maintain bike/run fitness, establish routine around soccer</span></div>
`;

// Weeks 1-4: original weeks 1-4 with dot updates
h+=getWeek(1,1)+'\n';
h+=getWeek(2,2)+'\n';
h+=getWeek(3,3)+'\n';

// Week 4: update coach note about "next four weeks"
let w4=getWeek(4,4);
w4=w4.replace('build phase starts next week','second base block starts next week');
w4=w4.replace('ready for the build phase starting next week','ready for the second base block starting next week');
w4=w4.replace('the next four weeks of building','the next four weeks of continued base building');
h+=w4+'\n';

// NEW Weeks 5-8 (extended base)
h+=`<!-- WEEK 5 -->
<section id="week-5" style="margin-bottom:16px">
<details class="week-accordion">
  <summary><span>Week 5 &mdash; Swim Drills + Longer Rides</span><span class="material-symbols-outlined chevron">expand_more</span></summary>
  <div class="week-content" data-week="5">
    <div class="progress-dots">
      ${D(5)}
      ${WI(5)}
    </div>
    <p class="week-overview">Second base block begins. Fresh from recovery, you push swim volume higher with drill-focused sessions, extend the long ride to 2 hr 45 min, and keep runs easy. The weekly template is established &mdash; now we progressively load it.</p>

    <div class="day-card"><div class="day-header"><span class="day-label">Monday</span><span class="day-session">Swim &mdash; Drill Focus + Endurance</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">2000m</span><span class="badge badge-accent">RPE 3&ndash;4</span></div></div>
    <p class="day-structure"><strong>Warm-up:</strong> 300m easy (100 free / 100 back / 100 choice). 4 &times; 50m catch-up drill with 15s rest. <strong>Main Set:</strong> 4 &times; 200m freestyle at Aerobic pace (2:03&ndash;2:09/100m) with 20s rest. Focus on high elbow catch and steady exhale. 4 &times; 50m pull with paddles at Aerobic pace with 10s rest. <strong>Cool-down:</strong> 200m easy backstroke.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Back to 2000m after last week&rsquo;s recovery. The 200m reps should feel more controlled than Week 3 &mdash; that is the recovery week paying off. Paddles are introduced for the first time: they increase the surface area of your hand, providing more feedback on catch mechanics and building swim-specific upper body strength. Start with small paddles. If your shoulders feel strain, drop the paddles and swim with normal hands.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Tuesday</span><span class="day-session">AM: Bike &mdash; Easy Endurance</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 112&ndash;143</span><span class="badge badge-accent">60 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 10 min easy warm-up Z1. 40 min steady Z2 (HR 112&ndash;143). Cadence 85&ndash;95 RPM. Include 2&ndash;3 gentle hill repeats (stay seated). 10 min cool-down Z1.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Steady aerobic riding before soccer. The seated hill repeats continue to build force production without structured intensity. Your cycling base is strong from 150 km/week &mdash; we are maintaining and refining, not rebuilding. Save your legs for soccer this afternoon.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Wednesday</span><span class="day-session">AM: Swim &mdash; Bilateral + PM: Run &mdash; Easy</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-run">RUN</span><span class="badge badge-accent">Double Day</span></div></div>
    <p class="day-structure"><strong>AM Swim (1600m):</strong> 200m easy warm-up. 4 &times; 50m bilateral breathing drill (3-5-3-5 pattern) with 15s rest. 6 &times; 150m at Aerobic pace (2:03&ndash;2:09/100m) with 20s rest. 200m easy cool-down.<br><br><strong>PM Run (40 min):</strong> 5 min walk warm-up. 30 min easy at T2 (HR 120&ndash;151, pace 5:15&ndash;6:00/km). 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>The 150m reps are a new distance &mdash; longer than 100s, shorter than 200s. They build sustained effort while keeping the set feeling fresh. Run volume stays at 30 min easy. Your soccer load on Tue/Thu adds significant running stimulus already. Easy means easy &mdash; if HR sits above 151, slow down.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Thursday</span><span class="day-session">AM: Bike &mdash; Cadence + Tempo Touch</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 112&ndash;159</span><span class="badge badge-accent">55 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 10 min warm-up Z1. 3 &times; 5 min high cadence at 95&ndash;105 RPM in Z2 with 3 min normal between. 1 &times; 8 min at Z3 tempo (HR 143&ndash;159). 5 min cool-down Z1.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Combining cadence work with a single tempo block. The tempo touch keeps your body familiar with the effort that will define your race-day bike pace. One 8-min block is enough to stimulate adaptation without compromising soccer this afternoon. Cadence drills first, tempo second &mdash; quality pedalling at race effort.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Friday</span><span class="day-session">Swim &mdash; Easy + Sighting</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">1200m</span><span class="badge badge-accent">RPE 2&ndash;3</span></div></div>
    <p class="day-structure">200m warm-up. 6 &times; 50m sighting drill with 15s rest. 4 &times; 100m easy freestyle at Recovery pace. 200m cool-down with backstroke.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Pre-game easy swim. Sighting drills are becoming habitual now &mdash; that is the goal. By the time you race in open water, sighting every 8&ndash;10 strokes will be automatic. Keep this session low-stress and technique-focused.</div></div>

    ${saturday}

    <div class="day-card"><div class="day-header"><span class="day-label">Sunday</span><span class="day-session">Bike &mdash; Long Ride</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 112&ndash;143</span><span class="badge badge-accent">2 hr 45 min</span><span class="badge badge-red">KEY</span></div></div>
    <p class="day-structure">15 min warm-up Z1. 2 hr 15 min steady Z2 (HR 112&ndash;143). Flat to rolling route. Cadence 85&ndash;95 RPM. Hydrate 500&ndash;600 mL/hr. Practise eating &mdash; try different products from previous weeks. 15 min cool-down Z1.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Back to the 2 hr 45 min duration from Week 3. This should feel easier than it did two weeks ago &mdash; that is recovery working. Continue testing nutrition products. By now you should have a short list of what works for your stomach. Stick to those products going forward. The base phase is about building the aerobic engine and finding your race-day nutrition strategy.</div></div>

    <div class="key-callout"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">star</span> Key Workout &mdash; Sunday Long Ride (2 hr 45 min)</h4><p>Consolidating duration from the first base block. This should feel more comfortable than Week 3&rsquo;s long ride. Nutrition practice continues &mdash; refine your product choices.</p></div>
    <div class="recovery-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">nightlight</span> Recovery</h4><p>Back to building after recovery. Sleep target remains 7.5&ndash;8 hours. Post-ride carbs + protein within 60 min. Your body has absorbed the first three weeks of training &mdash; you should feel a noticeable improvement in swim comfort and cycling endurance this week.</p></div>
    <div class="checkin-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">psychology</span> Weekly Check-In</h4><p>&ldquo;Do I feel fresher than Week 3? Is the same 2hr 45min ride easier? Am I finding nutrition products that work for me?&rdquo;</p></div>
  </div>
</details>
</section>

`;

// WEEK 6
h+=`<!-- WEEK 6 -->
<section id="week-6" style="margin-bottom:16px">
<details class="week-accordion">
  <summary><span>Week 6 &mdash; Strides + Swim Distance</span><span class="material-symbols-outlined chevron">expand_more</span></summary>
  <div class="week-content" data-week="6">
    <div class="progress-dots">
      ${D(6)}
      ${WI(6)}
    </div>
    <p class="week-overview">Strides appear in the run to develop neuromuscular speed. Swim distance builds to 2200m on Monday. The long ride extends to 3 hours. Progressive aerobic development continues.</p>

    <div class="day-card"><div class="day-header"><span class="day-label">Monday</span><span class="day-session">Swim &mdash; Distance Build</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">2200m</span><span class="badge badge-accent">RPE 3&ndash;4</span></div></div>
    <p class="day-structure"><strong>Warm-up:</strong> 300m easy. 4 &times; 50m single-arm drill with 15s rest. <strong>Main Set:</strong> 3 &times; 300m freestyle at Aerobic pace (2:03&ndash;2:09/100m) with 25s rest. Sight every 10 strokes. 4 &times; 50m pull with paddles. <strong>Cool-down:</strong> 200m easy choice.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>The 300m reps return &mdash; they should feel more manageable than Week 3. Your stroke is becoming more efficient through five weeks of consistent drill work. Continue sighting practice during main sets to make it automatic. Paddles continue to build swim-specific strength. If your CSS has improved since the Week 1 test, these aerobic reps will feel notably easier.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Tuesday</span><span class="day-session">AM: Run &mdash; Easy + Strides</span><div class="day-badges"><span class="badge badge-run">RUN</span><span class="badge badge-accent">HR 120&ndash;151</span><span class="badge badge-accent">40 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 5 min walk warm-up. 25 min easy at T2 (HR 120&ndash;151, pace 5:15&ndash;6:00/km). 4 &times; 20-sec strides with 40-sec jog recovery. 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Strides return. These are not sprints &mdash; smooth, controlled accelerations to ~85% effort focusing on tall posture and quick turnover. They develop running economy without adding fatigue. Your ankle should be fully stable by now. Soccer this afternoon provides the hard running effort.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Wednesday</span><span class="day-session">AM: Swim &mdash; Descend Set + PM: Run &mdash; Easy</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-run">RUN</span><span class="badge badge-accent">Double Day</span></div></div>
    <p class="day-structure"><strong>AM Swim (1800m):</strong> 200m warm-up. 4 &times; 50m fingertip drag drill with 15s rest. 8 &times; 100m at Aerobic pace with 15s rest &mdash; descend 1&ndash;4, repeat 5&ndash;8 (each group of 4 gets progressively faster). 4 &times; 50m kick. 200m cool-down.<br><br><strong>PM Run (35 min):</strong> 5 min walk warm-up. 25 min easy at T2 (HR 120&ndash;151). 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Descending sets teach pace awareness and the ability to accelerate under mild fatigue &mdash; a skill you will use in the back half of the race swim. The PM run stays easy. With 24 weeks of training, there is no rush to add run intensity &mdash; the base phase builds the aerobic foundation that supports everything later.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Thursday</span><span class="day-session">AM: Bike &mdash; Endurance + Hills</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 112&ndash;143</span><span class="badge badge-accent">60 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 10 min warm-up Z1. 40 min steady Z2 (HR 112&ndash;143) including 4&ndash;5 seated hill climbs (cadence 70+ RPM, allow HR to touch Z3 on climbs only). 10 min cool-down Z1.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Slightly longer than previous Thursday sessions. The additional hill repeats build muscular endurance without structured intensity. Stay seated on all climbs &mdash; this develops the specific force production needed for 90 km of race-pace cycling. Soccer this afternoon completes the day.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Friday</span><span class="day-session">Swim &mdash; Easy Technique</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">1200m</span><span class="badge badge-accent">RPE 2&ndash;3</span></div></div>
    <p class="day-structure">200m warm-up. 6 &times; 50m drill rotation (catch-up, fingertip drag, single-arm) with 20s rest. 4 &times; 100m easy freestyle at Recovery pace. 200m cool-down.</p></div>

    ${saturday}

    <div class="day-card"><div class="day-header"><span class="day-label">Sunday</span><span class="day-session">Bike &mdash; Long Ride</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 112&ndash;143</span><span class="badge badge-accent">3 hrs</span><span class="badge badge-red">KEY</span></div></div>
    <p class="day-structure">15 min warm-up Z1. 2 hr 30 min steady Z2 (HR 112&ndash;143). Flat to rolling route. Cadence 85&ndash;95 RPM. Hydrate 500&ndash;700 mL/hr. Nutrition: practise eating 30&ndash;40 g carbs/hr (the products you have identified work for you). 15 min cool-down Z1.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Your first 3-hour ride in this plan. This is the distance you will eventually ride at race pace. Today, ride it all in Z2 &mdash; the goal is duration, not intensity. Nutrition practice is important: by now you should be comfortable eating on the bike. If you are still struggling with GI issues, try switching to liquid calories (sports drink) instead of solid food.</div></div>

    <div class="key-callout"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">star</span> Key Workout &mdash; Sunday Long Ride (3 hrs)</h4><p>First 3-hour ride. A milestone in your preparation. Stay in Z2, practise nutrition, and prove to your body that 3 hours on the bike is manageable.</p></div>
    <div class="recovery-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">nightlight</span> Recovery</h4><p>Longest ride yet. Post-ride: carbs + protein within 30 min. Anti-inflammatory foods tonight. Sleep 8+ hours. The long ride is your biggest recovery demand of the week &mdash; respect it.</p></div>
    <div class="checkin-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">psychology</span> Weekly Check-In</h4><p>&ldquo;How did the 3-hour ride feel? Was Z2 sustainable the whole time? Is my nutrition strategy working?&rdquo;</p></div>
  </div>
</details>
</section>

`;

// WEEK 7
h+=`<!-- WEEK 7 -->
<section id="week-7" style="margin-bottom:16px">
<details class="week-accordion">
  <summary><span>Week 7 &mdash; Longest Base Week</span><span class="material-symbols-outlined chevron">expand_more</span></summary>
  <div class="week-content" data-week="7">
    <div class="progress-dots">
      ${D(7)}
      ${WI(7)}
    </div>
    <p class="week-overview">The biggest base week. Swim reaches 2400m, the long ride pushes to 3 hr 15 min, and a tempo block returns to Thursday&rsquo;s bike. This is the peak of base volume &mdash; recovery week follows. Run distance extends to 14 km on Wednesday.</p>

    <div class="day-card"><div class="day-header"><span class="day-label">Monday</span><span class="day-session">Swim &mdash; Aerobic Endurance</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">2400m</span><span class="badge badge-accent">RPE 3&ndash;4</span></div></div>
    <p class="day-structure"><strong>Warm-up:</strong> 300m easy. 4 &times; 50m catch-up drill with 15s rest. <strong>Main Set:</strong> 2 &times; 400m freestyle at Aerobic pace (2:03&ndash;2:09/100m) with 30s rest. 4 &times; 100m freestyle at Aerobic pace with 15s rest. 4 &times; 50m pull with paddles. <strong>Cool-down:</strong> 200m easy.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>The 400m reps build sustained swimming endurance beyond race distance segments. Two continuous 400m efforts at aerobic pace teach your body to hold form and rhythm for extended durations. This is the longest swim of the base phase. If your stroke count stays consistent across both 400s, your efficiency is developing well. Focus on relaxed shoulders and a patient catch.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Tuesday</span><span class="day-session">AM: Run &mdash; Easy + Strides</span><div class="day-badges"><span class="badge badge-run">RUN</span><span class="badge badge-accent">HR 120&ndash;151</span><span class="badge badge-accent">45 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 5 min walk warm-up. 30 min easy at T2 (HR 120&ndash;151). 6 &times; 15-sec strides with 45-sec jog. 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Slightly longer easy run with 6 strides instead of 4. Progressive overload at the neuromuscular level. The strides should feel effortless and fast by now &mdash; like a gear shift rather than an effort spike. Soccer this afternoon adds the hard work.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Wednesday</span><span class="day-session">AM: Swim &mdash; Pyramid + PM: Run &mdash; Easy Long</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-run">RUN</span><span class="badge badge-accent">Double Day</span></div></div>
    <p class="day-structure"><strong>AM Swim (2000m):</strong> 200m warm-up. 4 &times; 50m drill with 15s rest. Pyramid: 100&ndash;200&ndash;300&ndash;200&ndash;100 at Aerobic pace with 15s rest. 4 &times; 50m kick. 200m cool-down.<br><br><strong>PM Run (55 min / ~10 km):</strong> 5 min walk warm-up. 45 min easy at T2 (HR 120&ndash;151, pace 5:15&ndash;6:00/km). 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Longest PM run of the base phase at ~10 km. This is well within your capabilities given your 10K PB, but the key is keeping it genuinely easy after a morning swim. With soccer on Tue and Thu, Wednesday is the best day to extend the run because you have a full 24 hours of recovery before Thursday soccer. Keep HR below 151 &mdash; resist the urge to push the pace.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Thursday</span><span class="day-session">AM: Bike &mdash; Tempo Blocks</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 112&ndash;159</span><span class="badge badge-accent">60 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 10 min warm-up Z1. 2 &times; 10 min at Z3 tempo (HR 143&ndash;159) with 5 min Z2 recovery. 15 min steady Z2. 5 min cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Tempo blocks extend to 10 min each. Z3 (HR 143&ndash;159) is your race effort zone &mdash; the more time you spend here in training, the more comfortable it will feel on race day. Two 10-min blocks are enough to stimulate adaptation without compromising soccer this afternoon. Cadence 85&ndash;95 RPM throughout.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Friday</span><span class="day-session">Swim &mdash; OW Prep + Sighting</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">1400m</span><span class="badge badge-accent">RPE 2&ndash;3</span></div></div>
    <p class="day-structure">200m warm-up. 8 &times; 50m alternating sighting drill / bilateral breathing drill with 15s rest. 4 &times; 100m easy freestyle. 200m cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Next week you will swim in open water for the first time in this plan. This session reinforces the sighting and bilateral breathing skills you will need. Crocodile sighting: eyes only above water, every 10 strokes. Low fatigue, high skill development.</div></div>

    ${saturdayShort}

    <div class="day-card"><div class="day-header"><span class="day-label">Sunday</span><span class="day-session">Bike &mdash; Long Ride</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 112&ndash;143</span><span class="badge badge-accent">3 hr 15 min</span><span class="badge badge-red">KEY</span></div></div>
    <p class="day-structure">15 min warm-up Z1. 2 hr 45 min steady Z2 (HR 112&ndash;143). Include some rolling hills. Cadence 85&ndash;95 RPM. Hydrate 600&ndash;700 mL/hr. Nutrition: 30&ndash;40 g carbs/hr using your preferred products. 15 min cool-down Z1.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Longest base phase ride. 3 hr 15 min at Z2 is serious aerobic work. You should feel tired but not destroyed. This ride proves that your body can handle extended time on the bike &mdash; the foundation for race-day effort. Recovery week starts tomorrow. Eat well tonight.</div></div>

    <div class="key-callout"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">star</span> Key Workout &mdash; Sunday Long Ride (3 hr 15 min)</h4><p>The biggest ride of the base phase. This is serious aerobic development. Stay in Z2, practise nutrition, and know that recovery week absorbs this load.</p></div>
    <div class="recovery-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">nightlight</span> Recovery</h4><p>This was a demanding week. Fatigue is expected and by design &mdash; the recovery week absorbs it. Post-ride: immediate carbs + protein. Sleep 8+ hours tonight. If you are feeling run down, take an extra rest day before starting Week 8.</p></div>
    <div class="checkin-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">psychology</span> Weekly Check-In</h4><p>&ldquo;Am I handling the increased volume? How is my body recovering between sessions? Am I sleeping enough? Am I excited about the open water swim next week?&rdquo;</p></div>
  </div>
</details>
</section>

`;

// WEEK 8 - Recovery + OW Intro (adapted from original week 8)
let w8=getWeek(8,8,'Recovery + Open Water Intro');
// Update references to "peak phase starts next week" -> "build phase starts next week"
w8=w8.replace('peak phase starts next week','build phase starts next week');
w8=w8.replace('The peak phase starts next week','The build phase starts next week');
w8=w8.replace('Arrive fresh and hungry','Arrive fresh and hungry for the build phase');
w8=w8.replace('the build phase training from Weeks 5&ndash;7','the base training from Weeks 5&ndash;7');
h+=w8+'\n';

// ============= BUILD PHASE (Weeks 9-16) =============
h+=`
<!-- ======================================= BUILD PHASE ======================================= -->
<div class="phase-banner"><span class="phase-name">Build Phase</span><span class="phase-desc">&mdash; Weeks 9&ndash;16 &mdash; CSS swim intervals, tempo bike/run, first bricks, nutrition training</span></div>
`;

// Weeks 9-12 = original weeks 5-8, renumbered
// Week 9 = original week 5 (CSS Intervals + Nutrition)
let w9=getWeek(5,9,'CSS Intervals + Nutrition');
w9=w9.replace('Build phase begins.','Build phase begins.');
w9=w9.replace('introduce CSS-pace swim intervals for the first time','introduce CSS-pace swim intervals');
h+=w9+'\n';

// Week 10 = original week 6 (First Brick)
h+=getWeek(6,10,'First Brick')+'\n';

// Week 11 = original week 7 (Tempo Build)
h+=getWeek(7,11,'Tempo Build')+'\n';

// Week 12 = original week 8 as recovery, but we already used orig w8 for new w8
// We need a build-phase recovery week at w12. Let's create one based on original w12
let w12=getWeek(12,12,'Recovery');
w12=w12.replace('peak training from Weeks 9&ndash;11','build training from Weeks 9&ndash;11');
w12=w12.replace('The taper phase follows','The second build block follows');
w12=w12.replace('taper and sharpening','continued building and peak preparation');
h+=w12+'\n';

// Weeks 13-16 = original weeks 9-12, renumbered
// Week 13 = original week 9 (Race-Pace Bricks)
let w13=getWeek(9,13,'Race-Pace Bricks');
w13=w13.replace('Peak phase begins','Build phase continues');
h+=w13+'\n';

// Week 14 = original week 10 (Peak Volume I)
h+=getWeek(10,14,'Peak Volume I')+'\n';

// Week 15 = original week 11 (Peak Volume II)
let w15=getWeek(11,15,'Peak Volume II');
w15=w15.replace('the taper begins','the peak phase begins');
h+=w15+'\n';

// Week 16 = Recovery (based on original week 12)
let w16orig=getWeek(12,16,'Recovery');
w16orig=w16orig.replace('peak training from Weeks 9&ndash;11','build training from Weeks 13&ndash;15');
w16orig=w16orig.replace('The taper phase follows','The peak phase follows');
w16orig=w16orig.replace('you sharpen and taper','you peak and then taper');
h+=w16orig+'\n';

// ============= PEAK PHASE (Weeks 17-21) =============
h+=`
<!-- ======================================= PEAK PHASE ======================================= -->
<div class="phase-banner"><span class="phase-name">Peak Phase</span><span class="phase-desc">&mdash; Weeks 17&ndash;21 &mdash; Race simulation bricks, longest rides, open water, race nutrition rehearsal</span></div>
`;

// WEEK 17 - Race Sim Brick
h+=`<!-- WEEK 17 -->
<section id="week-17" style="margin-bottom:16px">
<details class="week-accordion">
  <summary><span>Week 17 &mdash; Race Simulation Brick</span><span class="material-symbols-outlined chevron">expand_more</span></summary>
  <div class="week-content" data-week="17">
    <div class="progress-dots">
      ${D(17)}
      ${WI(17)}
    </div>
    <p class="week-overview">Peak phase begins. Fresh from recovery, you hit the first full race-simulation brick: 90 min at race effort on the bike, then immediate 30-min run at race pace. The longest swim reaches 2800m. Nutrition locks in at 70&ndash;80 g/hr. This is the most race-specific block of the plan.</p>

    <div class="day-card"><div class="day-header"><span class="day-label">Monday</span><span class="day-session">Swim &mdash; CSS + Distance</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">2800m</span><span class="badge badge-accent">CSS</span><span class="badge badge-red">KEY</span></div></div>
    <p class="day-structure"><strong>Warm-up:</strong> 400m easy. 4 &times; 50m build with 15s rest. <strong>Main Set A:</strong> 5 &times; 200m at CSS pace (1:52&ndash;1:58/100m) with 20s rest. <strong>Main Set B:</strong> 4 &times; 100m at Aerobic pace with 15s rest. <strong>Pull:</strong> 4 &times; 75m pull with paddles at Aerobic pace with 10s rest. <strong>Cool-down:</strong> 200m easy backstroke.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Longest swim of the plan at 2800m. 1000m at CSS pace is a significant threshold volume. These 200m reps at CSS should feel faster than they did in Week 9 &mdash; that is 16 weeks of swim development paying off. If you retested CSS in Week 14, use the updated pace. Your race swim of 1900m will feel very manageable after this session. The aerobic 100s and pull set add volume without additional threshold stress.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Tuesday</span><span class="day-session">AM: Run &mdash; Easy</span><div class="day-badges"><span class="badge badge-run">RUN</span><span class="badge badge-accent">HR 120&ndash;151</span><span class="badge badge-accent">35 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 5 min walk warm-up. 25 min easy at T2 (HR 120&ndash;151). 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Easy day before soccer. The peak phase demands careful load management. Sunday&rsquo;s brick is the centrepiece of the week &mdash; protect your legs for it. Soccer provides the intensity today.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Wednesday</span><span class="day-session">AM: Open Water + PM: Run &mdash; Tempo</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-run">RUN</span><span class="badge badge-accent">Double Day</span></div></div>
    <p class="day-structure"><strong>AM Open Water (35&ndash;40 min):</strong> Warm up on shore. 5 min easy swim. 3 &times; 6 min at CSS effort with 1 min easy between. Sight every 8&ndash;10 strokes. Practise beach exit with momentum. 5 min easy.<br><br><strong>PM Run (50 min):</strong> 5 min walk warm-up. 10 min easy T2. 3 &times; 6 min at T3 tempo (HR 151&ndash;167, pace 4:45&ndash;5:15/km) with 2 min easy jog. 7 min easy T2. 2 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Open water at CSS effort is race rehearsal in real conditions. By now you should be comfortable in open water from Week 8 onwards. The sighting should be automatic. The PM tempo run is 18 min at T3 &mdash; close to race-day effort. Your run is your weapon and this session sharpens it. Nutrition note: start planning your exact race-day nutrition protocol. You have been building gut tolerance for 8 weeks now.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Thursday</span><span class="day-session">AM: Bike &mdash; Over-Unders</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 143&ndash;175</span><span class="badge badge-accent">65 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 10 min warm-up Z1. 3 &times; 8 min over-under: alternate 2 min Z4 (HR 159&ndash;175) / 2 min Z3 (HR 143&ndash;159) for 8 min. 5 min Z1 recovery between sets. 10 min easy cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Over-unders train lactate clearance during sustained efforts. The alternation between Z4 and Z3 simulates surges during the race &mdash; headwinds, hills, passing manoeuvres. Very demanding but very race-specific. Soccer this afternoon adds to the load &mdash; manage energy accordingly.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Friday</span><span class="day-session">Run &mdash; Easy Recovery</span><div class="day-badges"><span class="badge badge-run">RUN</span><span class="badge badge-accent">HR 105&ndash;120</span><span class="badge badge-accent">25 min</span></div></div>
    <p class="day-structure">5 min walk warm-up. 15 min very easy jog at T1 (HR 105&ndash;120, pace 6:30+/km). 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Recovery jog only. Active recovery before tomorrow&rsquo;s soccer. If you feel any cumulative fatigue, replace this with complete rest. Sunday&rsquo;s race-sim brick is the priority this week.</div></div>

    ${saturdayShort}

    <div class="day-card"><div class="day-header"><span class="day-label">Sunday</span><span class="day-session">Brick &mdash; Race Simulation</span><div class="day-badges"><span class="badge badge-brick">BRICK</span><span class="badge badge-accent">3.5 hrs total</span><span class="badge badge-red">KEY</span></div></div>
    <p class="day-structure"><strong>Bike (2 hr 45 min):</strong> 15 min warm-up Z1. 1 hr Z2. Last 90 min at Z3 (HR 143&ndash;159) &mdash; race effort. Nutrition: <strong>70&ndash;80 g/hr</strong>. Hydrate 750&ndash;1000 mL/hr. Use exact race-day products. <strong>Immediate transition.</strong> <strong>Run (30 min):</strong> 5 min whatever pace your legs give. 20 min at T2&ndash;T3 (HR 120&ndash;167, pace 5:00&ndash;5:30/km) &mdash; race pace. 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>First peak-phase brick. 90 min at Z3 on the bike is substantial &mdash; this simulates the race-day effort level on the bike. The transition to a 20-min race-pace run tells you exactly what race day will feel like. Nutrition at 70&ndash;80 g/hr using race-day products. Record everything: how your stomach felt, how your legs felt, what pace you held. This data informs your race-day strategy. The brick legs should be less than your first brick in Week 10 &mdash; that is adaptation.</div></div>

    <div class="key-callout"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">star</span> Key Workout &mdash; Sunday Race Simulation Brick</h4><p>The first peak-phase brick. Race-pace bike, race-pace run, race-level nutrition. Everything you learn here informs your race-day strategy.</p></div>
    <div class="recovery-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">nightlight</span> Recovery</h4><p>Major session. Post-session: carbs + protein within 30 min. Elevate legs. Sleep 8+ hours. Recovery is critical in the peak phase &mdash; the sessions are demanding and the margin for error is small.</p></div>
    <div class="checkin-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">psychology</span> Weekly Check-In</h4><p>&ldquo;Could I hold race pace on the run after the bike? Was 70&ndash;80 g/hr tolerable? Is my race-day nutrition protocol confirmed?&rdquo;</p></div>
  </div>
</details>
</section>

`;

// WEEK 18 - Peak Bike Volume
h+=`<!-- WEEK 18 -->
<section id="week-18" style="margin-bottom:16px">
<details class="week-accordion">
  <summary><span>Week 18 &mdash; Peak Bike Volume</span><span class="material-symbols-outlined chevron">expand_more</span></summary>
  <div class="week-content" data-week="18">
    <div class="progress-dots">
      ${D(18)}
      ${WI(18)}
    </div>
    <p class="week-overview">The longest ride of the plan: 3 hr 30 min with race-pace blocks. Tempo run extends to 8 km. Open water continues. This is peak bike volume &mdash; you are proving to your body that race distance is manageable.</p>

    <div class="day-card"><div class="day-header"><span class="day-label">Monday</span><span class="day-session">Swim &mdash; CSS + VO2max</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">2600m</span><span class="badge badge-accent">CSS + VO2</span></div></div>
    <p class="day-structure"><strong>Warm-up:</strong> 300m easy. 4 &times; 50m build with 15s rest. <strong>Main Set A:</strong> 4 &times; 200m at CSS pace (1:52&ndash;1:58/100m) with 20s rest. <strong>Main Set B:</strong> 8 &times; 50m at VO2max pace (1:45&ndash;1:50/100m) with 30s rest. <strong>Pull:</strong> 4 &times; 75m at Aerobic pace with 10s rest. <strong>Cool-down:</strong> 200m easy.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>CSS plus VO2max work. The 50m sprints at 1:45&ndash;1:50/100m develop your aerobic ceiling and make CSS pace feel easier by comparison. 8 reps is the highest VO2 swim volume in the plan. The long rest (30s) ensures maximal quality on each rep. This combination of threshold and speed work is the most effective way to improve race swim performance in the final phase of training.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Tuesday</span><span class="day-session">AM: Run &mdash; Easy + Strides</span><div class="day-badges"><span class="badge badge-run">RUN</span><span class="badge badge-accent">HR 120&ndash;151</span><span class="badge badge-accent">40 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 5 min warm-up. 25 min easy T2. 6 &times; 15-sec strides with 45-sec jog. 5 min cool-down.</p></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Wednesday</span><span class="day-session">AM: Open Water + PM: Run &mdash; Tempo</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-run">RUN</span><span class="badge badge-accent">Double Day</span></div></div>
    <p class="day-structure"><strong>AM Open Water (40 min):</strong> Warm up. 5 min easy. 2 &times; 8 min at CSS effort with 2 min easy. Practise mass start simulation: swim close to others, handle contact. 5 min easy.<br><br><strong>PM Run (55 min):</strong> 5 min warm-up. 10 min easy T2. 25 min continuous at T3 (HR 151&ndash;167, pace 4:45&ndash;5:15/km). 10 min easy T2. 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Tempo run increases to 25 min continuous &mdash; the longest tempo effort in the plan. This is approaching half-marathon race effort for 5 km. Your body is learning to sustain race-pace discomfort for extended periods. Open water: the contact drill desensitises the panic response for race-day mass starts. Practise the double cap method to protect goggles.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Thursday</span><span class="day-session">AM: Bike &mdash; Threshold</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 159&ndash;175</span><span class="badge badge-accent">65 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 10 min warm-up. 2 &times; 15 min at Z4 threshold (HR 159&ndash;175) with 5 min Z1 recovery. 10 min cool-down. Cadence 85&ndash;95 RPM.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>30 min at threshold. This raises your functional threshold &mdash; the power ceiling that determines your race-day speed. Z4 is hard and sustainable for 20&ndash;40 min. The second 15-min block will feel significantly harder than the first. Do not start too hard. Let HR climb naturally.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Friday</span><span class="day-session">Rest or Easy Swim</span><div class="day-badges"><span class="badge badge-rest">REST</span><span class="badge badge-swim">OPTIONAL</span></div></div>
    <p class="day-structure">Rest preferred. Optional: 1000m very easy pool swim &mdash; drills and backstroke only. No intensity.</p></div>

    ${saturdayShort}

    <div class="day-card"><div class="day-header"><span class="day-label">Sunday</span><span class="day-session">Bike &mdash; Long Ride + Race Blocks</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 112&ndash;159</span><span class="badge badge-accent">3 hr 30 min</span><span class="badge badge-red">KEY</span></div></div>
    <p class="day-structure">15 min warm-up Z1. 1 hr Z2. 3 &times; 20 min at Z3 (HR 143&ndash;159) at 1:15, 1:50, and 2:25 marks, with Z2 between. Remaining time Z2. Nutrition: <strong>70&ndash;80 g/hr</strong>. Hydrate 750&ndash;1000 mL/hr. 15 min cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Peak long ride of the entire plan. 3 hr 30 min is slightly longer than your race bike target (~2:25&ndash;2:30). The embedded Z3 blocks (3 &times; 20 min) simulate holding race pace on tired legs. Nutrition at race level: 70&ndash;80 g/hr. Use the exact products you plan to use on race day. Nothing new on race day. If you complete this ride at the prescribed effort and nutrition, you can absolutely complete the race bike. That is not hope &mdash; that is evidence.</div></div>

    <div class="key-callout"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">star</span> Key Workout &mdash; Sunday Long Ride (3 hr 30 min)</h4><p>The biggest ride of the entire plan. You are rehearsing race distance and race nutrition. 70&ndash;80 g/hr of carbs. Race-specific tempo blocks. Confidence builder.</p></div>
    <div class="recovery-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">nightlight</span> Recovery</h4><p>Massive session. Post-ride: immediate carbs + protein. Anti-inflammatory foods. Sleep 8+ hours. If you are carrying fatigue, make Friday a full rest day regardless.</p></div>
    <div class="checkin-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">psychology</span> Weekly Check-In</h4><p>&ldquo;Can I hold Z3 for 20-min blocks at the end of a 3+ hour ride? Is 70&ndash;80 g/hr tolerable? How is my overall energy?&rdquo;</p></div>
  </div>
</details>
</section>

`;

// WEEK 19 - Peak Week (biggest overall)
h+=`<!-- WEEK 19 -->
<section id="week-19" style="margin-bottom:16px">
<details class="week-accordion">
  <summary><span>Week 19 &mdash; Peak Week</span><span class="material-symbols-outlined chevron">expand_more</span></summary>
  <div class="week-content" data-week="19">
    <div class="progress-dots">
      ${D(19)}
      ${WI(19)}
    </div>
    <p class="week-overview">The biggest week of the entire plan. The race-simulation brick is the centrepiece &mdash; 2-hour bike at race effort with immediate 40-min run at race pace. Longest run of the plan: 18 km on Wednesday. After this week, volume drops and never returns. Everything from here is recovery, sharpening, and taper.</p>

    <div class="day-card"><div class="day-header"><span class="day-label">Monday</span><span class="day-session">Swim &mdash; Race Distance Simulation</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">2600m</span><span class="badge badge-accent">CSS</span></div></div>
    <p class="day-structure"><strong>Warm-up:</strong> 300m easy. 4 &times; 50m build. <strong>Main Set:</strong> 1900m continuous at CSS+ pace (CSS + 3&ndash;5 sec/100m, ~1:57&ndash;2:03/100m). Sight every 10 strokes. <strong>Cool-down:</strong> 200m easy backstroke.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Race distance simulation. 1900m continuous at slightly above CSS pace &mdash; the pace you will swim on race day. This is your dress rehearsal for the swim leg. Track your total time for the 1900m &mdash; add 10&ndash;15% for open water conditions and you have your race swim estimate. If this comes in under 38 min, you are on track for a ~35 min race swim.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Tuesday</span><span class="day-session">AM: Run &mdash; Easy</span><div class="day-badges"><span class="badge badge-run">RUN</span><span class="badge badge-accent">HR 120&ndash;151</span><span class="badge badge-accent">35 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 5 min walk warm-up. 25 min easy at T2. 5 min walk cool-down.</p></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Wednesday</span><span class="day-session">AM: Open Water + PM: Run &mdash; Long Tempo</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-run">RUN</span><span class="badge badge-accent">Double Day</span></div></div>
    <p class="day-structure"><strong>AM Open Water (40 min):</strong> Warm up. 5 min easy. 2 &times; 8 min at CSS effort with 2 min easy. Practise beach entry/exit with momentum. 5 min easy.<br><br><strong>PM Run (70 min / ~13 km):</strong> 5 min walk warm-up. 15 min easy T2. 20 min at T3 tempo (HR 151&ndash;167, pace 4:45&ndash;5:15/km). 15 min easy T2. 10 min at T3. 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Longest run of the plan at ~13 km with 30 min at tempo. The split tempo blocks (20 min + 10 min) simulate the race-day run pacing strategy: settle into race pace, maintain through the middle, and hold effort in the final kilometres. Your 10K PB of 45 min suggests this tempo pace (4:45&ndash;5:15/km) is sustainable. Open water remains race-specific.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Thursday</span><span class="day-session">AM: Bike &mdash; Race Simulation</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 143&ndash;159</span><span class="badge badge-accent">70 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 10 min warm-up. 45 min at Z3 (HR 143&ndash;159) &mdash; race effort, race cadence (85&ndash;95 RPM). Nutrition: practise race-day products at race-day intervals. 10 min easy cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>45 min continuous at race effort. The longest single tempo block on the bike. A direct preview of race day &mdash; sustained Z3 effort. Use your race-day nutrition products at race-day timing. Soccer this afternoon adds to the load.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Friday</span><span class="day-session">Rest</span><div class="day-badges"><span class="badge badge-rest">REST</span></div></div>
    <p class="day-structure">Complete rest. Prepare transition setup and nutrition for Sunday&rsquo;s race-simulation brick.</p></div>

    <div class="day-card rest"><div class="day-header"><span class="day-label">Saturday</span><span class="day-session">Soccer Game + Recovery</span><div class="day-badges"><span class="badge badge-rest">REST</span><span class="badge badge-accent">Soccer</span></div></div>
    <p class="day-structure">Soccer game. Refuel well. Early bed. Tomorrow is the biggest session of the plan.</p></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Sunday</span><span class="day-session">Race Simulation Brick</span><div class="day-badges"><span class="badge badge-brick">BRICK</span><span class="badge badge-accent">4+ hrs total</span><span class="badge badge-red">KEY</span></div></div>
    <p class="day-structure"><strong>Bike (3 hrs):</strong> 15 min warm-up Z1. 2 hr at Z2&ndash;Z3 (HR 112&ndash;159) &mdash; start Z2, build to Z3 in final hour. Last 45 min at steady Z3 (race effort). Nutrition: <strong>70&ndash;80 g/hr</strong>. Hydrate 750&ndash;1000 mL/hr. Set up a transition area. <strong>Immediate transition.</strong> <strong>Run (45 min&ndash;1 hr):</strong> 5 min easy. 30&ndash;40 min at T2&ndash;T3 (HR 120&ndash;167, pace 5:00&ndash;5:30/km). 10 min easy cool-down walk.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>This is your race rehearsal. The closest you will get to race day before race day. Set up a proper transition area &mdash; lay out your run shoes, hat, nutrition. Practise the entire sequence: dismount, rack, helmet off, shoes on, go. The run should start at whatever pace your legs give, then build to race pace within 10 min. If you complete this session at the prescribed effort and nutrition, you have the fitness and the strategy to go sub-5. That is not hope &mdash; that is data. Record your total time, nutrition intake, how your stomach felt, and how your legs felt at the end.</div></div>

    <div class="key-callout"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">star</span> Key Workout &mdash; Sunday Race Simulation Brick</h4><p>The single most important session in this plan. Full race-pace bike, full race-pace run, full race-day nutrition. If this goes well, you know you can do it on September 14.</p></div>
    <div class="recovery-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">nightlight</span> Recovery</h4><p>Biggest week of the plan. Recovery week is next. Post-session: immediate carbs + protein + electrolytes. Sleep 8&ndash;9 hours. Anti-inflammatory foods. Gentle stretching. Do not train Monday if your body says no.</p></div>
    <div class="checkin-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">psychology</span> Weekly Check-In</h4><p>&ldquo;I completed the race simulation. How did I feel? What needs adjusting in my nutrition? My pacing? My transition?&rdquo;</p></div>
  </div>
</details>
</section>

`;

// WEEK 20 - Recovery
h+=`<!-- WEEK 20 -->
<section id="week-20" style="margin-bottom:16px">
<details class="week-accordion">
  <summary><span>Week 20 &mdash; Recovery</span><span class="material-symbols-outlined chevron">expand_more</span></summary>
  <div class="week-content" data-week="20">
    <div class="progress-dots">
      ${D(20)}
      ${WI(20)}
    </div>
    <p class="week-overview">Final recovery week. Volume drops to ~55% of Week 19. Your body is absorbing the peak training. The taper follows. Trust the process &mdash; the fitness is in the bank.</p>

    <div class="day-card"><div class="day-header"><span class="day-label">Monday</span><span class="day-session">Swim &mdash; Easy Technique</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">1400m</span><span class="badge badge-rest">RPE 2&ndash;3</span></div></div>
    <p class="day-structure">200m warm-up. 6 &times; 50m drill rotation with 20s rest. 6 &times; 100m easy freestyle at Recovery/Aerobic pace with 15s rest. 200m cool-down.</p></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Tuesday</span><span class="day-session">AM: Easy Spin</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR &lt;112</span><span class="badge badge-accent">30 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 30 min very easy Z1 spin. Active recovery.</p></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Wednesday</span><span class="day-session">AM: Pool Swim + PM: Easy Run</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-run">RUN</span><span class="badge badge-accent">Double Day</span></div></div>
    <p class="day-structure"><strong>AM Swim (1200m):</strong> 200m warm-up. 4 &times; 100m at CSS pace with 20s rest (keep the feel, low volume). 4 &times; 50m easy kick. 200m cool-down.<br><br><strong>PM Run (30 min):</strong> 5 min walk warm-up. 20 min easy at T2. 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Maintaining feel at CSS pace but with much lower volume. 400m at CSS vs. 1000m+ in peak weeks. The body remembers the pace &mdash; you just need to remind it occasionally. The run is short and easy.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Thursday</span><span class="day-session">AM: Rest</span><div class="day-badges"><span class="badge badge-rest">REST</span></div></div>
    <p class="day-structure">No morning session. Soccer this afternoon. Extra sleep.</p></div>

    <div class="day-card rest"><div class="day-header"><span class="day-label">Friday</span><span class="day-session">Rest</span><div class="day-badges"><span class="badge badge-rest">REST</span></div></div>
    <p class="day-structure">Complete rest.</p></div>

    ${saturdayShort}

    <div class="day-card"><div class="day-header"><span class="day-label">Sunday</span><span class="day-session">Bike &mdash; Easy Ride</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 112&ndash;143</span><span class="badge badge-accent">2 hrs</span></div></div>
    <p class="day-structure">15 min warm-up. 1 hr 30 min steady Z2. Nutrition: maintain 60 g/hr. 15 min cool-down. Coffee stop.</p></div>

    <div class="key-callout" style="border-color:rgba(46,125,50,0.2);background:rgba(46,125,50,0.05);border-left:3px solid var(--green)"><h4 style="color:var(--green)"><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">spa</span> No Key Workout This Week</h4><p>Rest. Absorb. Recover. The fitness is in the bank. You should feel fresh, hungry, and fast by the end of this week.</p></div>
    <div class="recovery-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">nightlight</span> Recovery</h4><p>Sleep 8&ndash;9 hours every night. Eat well. Spend time with family and friends. The hard work is done. From here, one more peak week and then taper.</p></div>
    <div class="checkin-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">psychology</span> Weekly Check-In</h4><p>&ldquo;Do I feel fresher than Week 19? Am I confident after the race simulation? Do I know my race-day nutrition and pacing strategy?&rdquo;</p></div>
  </div>
</details>
</section>

`;

// WEEK 21 - Final Peak
h+=`<!-- WEEK 21 -->
<section id="week-21" style="margin-bottom:16px">
<details class="week-accordion">
  <summary><span>Week 21 &mdash; Final Peak</span><span class="material-symbols-outlined chevron">expand_more</span></summary>
  <div class="week-content" data-week="21">
    <div class="progress-dots">
      ${D(21)}
      ${WI(21)}
    </div>
    <p class="week-overview">Final hard week before the taper. A sharpening brick at race pace, confident intervals in the pool, and one last open water session. Volume is lower than Week 19 but intensity is maintained. After this week, volume drops and never returns.</p>

    <div class="day-card"><div class="day-header"><span class="day-label">Monday</span><span class="day-session">Swim &mdash; CSS Sharpener</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-accent">2200m</span><span class="badge badge-accent">CSS + VO2</span></div></div>
    <p class="day-structure"><strong>Warm-up:</strong> 300m easy. 4 &times; 50m build. <strong>Main Set:</strong> 6 &times; 150m at CSS pace (1:52&ndash;1:58/100m) with 15s rest &mdash; descend 1&ndash;3, repeat 4&ndash;6. 4 &times; 50m at VO2max pace (1:45&ndash;1:50/100m) with 30s rest. <strong>Cool-down:</strong> 200m easy.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Sharpening session. The descending CSS reps build pace awareness and teach acceleration under fatigue. The VO2 50s keep your top-end speed alive. You should feel faster than any point in the plan &mdash; that is the recovery week supercompensation working. This is the last hard swim before taper.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Tuesday</span><span class="day-session">AM: Run &mdash; Easy + Strides</span><div class="day-badges"><span class="badge badge-run">RUN</span><span class="badge badge-accent">HR 120&ndash;151</span><span class="badge badge-accent">40 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 5 min warm-up. 25 min easy T2. 6 &times; 15-sec strides with 45-sec jog. 5 min cool-down.</p></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Wednesday</span><span class="day-session">AM: Open Water + PM: Run &mdash; Tempo</span><div class="day-badges"><span class="badge badge-swim">SWIM</span><span class="badge badge-run">RUN</span><span class="badge badge-accent">Double Day</span></div></div>
    <p class="day-structure"><strong>AM Open Water (30&ndash;35 min):</strong> Warm up. 5 min easy. 2 &times; 6 min at CSS effort with 2 min easy. Sighting practice. 5 min easy swim.<br><br><strong>PM Run (50 min):</strong> 5 min warm-up. 10 min easy T2. 20 min continuous at T3 (HR 151&ndash;167, pace 4:45&ndash;5:15/km). 10 min easy T2. 5 min walk cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Last open water session before taper. This should feel smooth and confident. The 20-min tempo run is race-pace consolidation &mdash; your body knows this effort intimately by now. Nutrition note: confirm your exact race-day plan this week: products, timing, amounts. Write it down.</div></div>

    <div class="day-card"><div class="day-header"><span class="day-label">Thursday</span><span class="day-session">AM: Bike &mdash; Race-Pace Touch</span><div class="day-badges"><span class="badge badge-bike">BIKE</span><span class="badge badge-accent">HR 143&ndash;175</span><span class="badge badge-accent">60 min</span></div></div>
    <p class="day-structure"><strong>AM (before soccer).</strong> 10 min warm-up. 2 &times; 12 min at Z3 (HR 143&ndash;159) with 3 min Z1. 1 &times; 8 min at Z4 (HR 159&ndash;175). 8 min cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Last hard bike session. The Z4 block keeps your threshold ceiling high while the Z3 blocks maintain race-pace familiarity. After today, bike intensity drops to short openers only. Soccer this afternoon.</div></div>

    <div class="day-card rest"><div class="day-header"><span class="day-label">Friday</span><span class="day-session">Rest</span><div class="day-badges"><span class="badge badge-rest">REST</span></div></div>
    <p class="day-structure">Complete rest. Prepare for Sunday&rsquo;s final hard brick.</p></div>

    ${saturdayShort}

    <div class="day-card"><div class="day-header"><span class="day-label">Sunday</span><span class="day-session">Brick &mdash; Sharpener</span><div class="day-badges"><span class="badge badge-brick">BRICK</span><span class="badge badge-accent">2.5 hrs total</span><span class="badge badge-red">KEY</span></div></div>
    <p class="day-structure"><strong>Bike (2 hrs):</strong> 15 min warm-up. 1 hr Z2. 30 min at Z3 (race effort). 15 min cool-down. Nutrition: 70 g/hr (race protocol). <strong>Immediate transition.</strong> <strong>Run (20 min):</strong> 5 min easy. 10 min at race pace (5:00&ndash;5:15/km). 5 min easy cool-down.</p>
    <div class="coach-note"><strong>Coach&rsquo;s Note</strong>Last significant brick before race day. Shorter than the race-sim bricks but at full race intensity. The 10-min race-pace run should feel controlled and confident &mdash; this is the pace you will hold for 21.1 km. If it feels comfortable, your taper is about to supercharge you further. Record your final nutrition protocol: exact products, exact timing, exact amounts. This is your confirmed race-day plan.</div></div>

    <div class="key-callout"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">star</span> Key Workout &mdash; Sunday Brick Sharpener</h4><p>Last hard brick. Race intensity, race nutrition, race transition. You are sharp and ready for the taper.</p></div>
    <div class="recovery-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">nightlight</span> Recovery</h4><p>The hard work is done. Taper begins next week. Sleep 8+ hours. Post-brick recovery nutrition within 30 min. Your body will begin supercompensating from here &mdash; trust the process.</p></div>
    <div class="checkin-box"><h4><span class="material-symbols-outlined" style="font-size:16px;margin-right:4px">psychology</span> Weekly Check-In</h4><p>&ldquo;Am I confident in my race-day plan? Is my nutrition protocol confirmed? Am I mentally ready for the taper?&rdquo;</p></div>
  </div>
</details>
</section>

`;

// ============= TAPER PHASE (Weeks 22-24) =============
h+=`
<!-- ======================================= TAPER PHASE ======================================= -->
<div class="phase-banner"><span class="phase-name">Taper Phase</span><span class="phase-desc">&mdash; Weeks 22&ndash;24 &mdash; Volume drops, intensity maintained, race week on 14 September</span></div>
`;

// Week 22 = adapted from original week 13 (Race Rehearsal -> Taper 1 at 70%)
let w22=getWeek(13,22,'Taper 1 &mdash; 70% Volume');
w22=w22.replace('First taper week. Volume drops ~20% from peak','Taper begins. Volume drops to ~70% of peak');
w22=w22.replace('first taper week','first taper week');
h+=w22+'\n';

// Week 23 = adapted from original week 15 (Taper II -> Taper 2 at 50%)
let w23=getWeek(15,23,'Taper 2 &mdash; 50% Volume');
w23=w23.replace('Next Sunday you race.','Race week begins next Monday.');
h+=w23+'\n';

// Week 24 = Race Week (from original week 16)
let w24=getWeek(16,24,'Race Week');
w24=w24.replace(WI(24), WI(24,'RACE WEEK'));
// Fix the week indicator manually since the regex might not catch the extra text
w24=w24.replace(/Week 24 of 24(?! &mdash;)/, 'Week 24 of 24 &mdash; RACE WEEK');
h+=w24+'\n';

// ============= POST-WEEK SECTIONS =============
// Extract from original: Race Day Pacing through end of file
const raceDayIdx=o.indexOf('<!-- Race Day Pacing Summary -->');
const footerContent=o.substring(raceDayIdx);
// Update references from 16 to 24 weeks
let fc=footerContent;
fc=fc.replace(/16 weeks/g,'24 weeks');
fc=fc.replace(/16-week/g,'24-week');
fc=fc.replace(/in 16 weeks/g,'in 24 weeks');
fc=fc.replace('Weeks 4, 8, and 12','Weeks 4, 8, 12, 16, and 20');
fc=fc.replace('from Week 5','from Week 9');
fc=fc.replace('Gut Training','Gut Training');
fc=fc.replace('40 g/hr (Week 5)','40 g/hr (Week 9)');
fc=fc.replace('mentally stronger than you were 16 weeks ago','mentally stronger than you were 24 weeks ago');
h+=fc;

// Write output
fs.writeFileSync(OUT,h,'utf8');
console.log('Done! File written: '+h.length+' chars, ~'+h.split('\n').length+' lines');
