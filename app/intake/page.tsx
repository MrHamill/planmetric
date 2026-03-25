"use client";

import { useState } from "react";

/* ─── Constants ─────────────────────────────────────────────── */
const TRIATHLON = ["Sprint Triathlon", "Olympic Triathlon", "70.3 Ironman", "Full Ironman"];
const CYCLING = ["Cycling Event"];

/* ─── Types ─────────────────────────────────────────────────── */
interface FD {
  // S1 — Personal
  fullName: string; email: string; age: string; gender: string;
  height: string; weight: string; location: string;
  // S2 — Race & Goal
  trainingFor: string; raceName: string; raceDate: string;
  mainGoal: string; targetTime: string;
  completedRaceBefore: string; previousFinishTime: string;
  // S3 — Fitness
  trainingConsistency: string; recentRaceResult: string; splitTimes: string;
  maxHR: string; maxHRUnknown: boolean; restingHR: string; restingHRUnknown: boolean;
  // S4 — Swim
  swimPaceEasy: string; swimPaceHard: string; weeklySwimVolume: string;
  longestSwim: string; bilateralBreathing: string;
  poolAccess: string; openWaterAccess: string; wetsuit: string;
  // S5 — Bike
  avgBikeSpeed: string; weeklyBikeVolume: string; longestRide: string;
  ftp: string; ftpUnknown: boolean; bikeType: string; powerMeter: string; indoorTrainer: string;
  // S6 — Run
  weeklyRunDistance: string; longestRun: string; easyRunPace: string;
  recentRunRace: string; treadmillAccess: string;
  // S7 — Discipline Ranking
  weakestDiscipline: string; strongestDiscipline: string;
  // S8 — Schedule
  trainingDaysPerWeek: string; restDaysPerWeek: string;
  preferredTimes: string[]; availableDays: string[];
  maxWeekdaySession: string; maxWeekendSession: string;
  doubleDays: string; doubleDayCombos: string[];
  preferredLongDay: string; preferredRestDay: string;
  workShifts: string; unavailableWeeks: string;
  // S9 — Equipment
  gpsWatch: string; gymAccess: string; equipmentBudget: string;
  // S10 — Health
  currentInjuries: string; injuryDescription: string; injuryHistory: string;
  avgSleep: string; stressLevel: string; raceNutrition: string;
  dietaryRestrictions: string; strengthTraining: string;
  // S11 — Motivation
  trainingPreference: string; intensityFeeling: string;
  trainingBlockers: string; motivation: string; successDefinition: string;
}

const INIT: FD = {
  fullName: "", email: "", age: "", gender: "", height: "", weight: "", location: "",
  trainingFor: "", raceName: "", raceDate: "", mainGoal: "", targetTime: "",
  completedRaceBefore: "", previousFinishTime: "",
  trainingConsistency: "", recentRaceResult: "", splitTimes: "",
  maxHR: "", maxHRUnknown: false, restingHR: "", restingHRUnknown: false,
  swimPaceEasy: "", swimPaceHard: "", weeklySwimVolume: "", longestSwim: "",
  bilateralBreathing: "", poolAccess: "", openWaterAccess: "", wetsuit: "",
  avgBikeSpeed: "", weeklyBikeVolume: "", longestRide: "", ftp: "",
  ftpUnknown: false, bikeType: "", powerMeter: "", indoorTrainer: "",
  weeklyRunDistance: "", longestRun: "", easyRunPace: "", recentRunRace: "", treadmillAccess: "",
  weakestDiscipline: "", strongestDiscipline: "",
  trainingDaysPerWeek: "", restDaysPerWeek: "", preferredTimes: [], availableDays: [],
  maxWeekdaySession: "", maxWeekendSession: "", doubleDays: "", doubleDayCombos: [],
  preferredLongDay: "", preferredRestDay: "", workShifts: "", unavailableWeeks: "",
  gpsWatch: "", gymAccess: "", equipmentBudget: "",
  currentInjuries: "", injuryDescription: "", injuryHistory: "",
  avgSleep: "", stressLevel: "", raceNutrition: "", dietaryRestrictions: "", strengthTraining: "",
  trainingPreference: "", intensityFeeling: "", trainingBlockers: "", motivation: "", successDefinition: "",
};

/* ─── Shared CSS ─────────────────────────────────────────────── */
const inp = "w-full bg-surface-container-low border border-outline-variant/20 px-4 py-3 font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors rounded-sm";
const lbl = "font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block";
const hint = "font-label text-[10px] text-on-surface-variant/50 mt-1.5";

/* ─── Primitive components (defined outside to prevent remounting) ── */
function F({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={lbl}>{label}</label>
      {children}
      {note && <p className={hint}>{note}</p>}
    </div>
  );
}

function TextInput({ value, onChange, type = "text", placeholder = "", disabled = false }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={inp + (disabled ? " opacity-30 pointer-events-none" : "")}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder = "Select..." }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={inp + " appearance-none cursor-pointer"}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function TextareaInput({ value, onChange, placeholder = "", rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={inp + " resize-none"}
    />
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-2 cursor-pointer">
      <span className={`w-4 h-4 flex-shrink-0 border rounded-sm flex items-center justify-center transition-colors ${checked ? "bg-primary border-primary" : "border-outline-variant/40 bg-surface-container-low"}`}>
        {checked && <span className="material-symbols-outlined text-on-primary" style={{ fontSize: "12px" }}>check</span>}
      </span>
      <span className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant whitespace-nowrap">{label}</span>
    </button>
  );
}

function MultiSelect({ selected, onChange, options }: {
  selected: string[]; onChange: (v: string[]) => void; options: string[];
}) {
  function toggle(o: string) {
    onChange(selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o]);
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
      {options.map(o => {
        const on = selected.includes(o);
        return (
          <button key={o} type="button" onClick={() => toggle(o)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-body text-left border transition-colors rounded-sm ${on ? "border-primary bg-primary/10 text-on-surface" : "border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:border-primary/40"}`}>
            <span className={`w-4 h-4 flex-shrink-0 border rounded-sm flex items-center justify-center transition-colors ${on ? "bg-primary border-primary" : "border-outline-variant/40"}`}>
              {on && <span className="material-symbols-outlined text-on-primary" style={{ fontSize: "12px" }}>check</span>}
            </span>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function InfoBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-surface-container-low border-l-2 border-primary px-5 py-4">
      <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-1">{title}</p>
      <p className="font-body text-sm text-on-surface-variant">{body}</p>
    </div>
  );
}

/* ─── Section metadata ───────────────────────────────────────── */
const META: Record<number, { num: string; title: string; sub: string }> = {
  1:  { num: "01", title: "Personal Details",       sub: "The basics — needed for accurate zone calculations and recovery guidance." },
  2:  { num: "02", title: "Race & Goal",             sub: "Tell us about the event you are building toward." },
  3:  { num: "03", title: "Current Fitness",         sub: "Where you are right now determines exactly where we start." },
  4:  { num: "04", title: "Swim",                    sub: "Your current swim capability and available resources." },
  5:  { num: "05", title: "Bike",                    sub: "Your cycling data and access." },
  6:  { num: "06", title: "Run",                     sub: "Your running baseline — every plan type includes running." },
  7:  { num: "07", title: "Discipline Ranking",      sub: "How we balance your training load across disciplines." },
  8:  { num: "08", title: "Schedule & Availability", sub: "We build around your life, not the other way around." },
  9:  { num: "09", title: "Equipment & Access",      sub: "What you have determines what we can prescribe." },
  10: { num: "10", title: "Health & Recovery",       sub: "Injuries and recovery are hard data points, not optional details." },
  11: { num: "11", title: "Motivation & Preferences",sub: "Your voice shapes your coach notes and plan tone." },
};

/* ─── Plan config ────────────────────────────────────────────── */
const PLANS = [
  {
    id: "starter",
    level: "Level 01",
    name: "STARTER",
    price: "$49",
    billing: "one-time",
    features: ["Pre-built goal paths", "Instant digital download", "Standard metric tracking"],
  },
  {
    id: "premium",
    level: "Level 02",
    name: "PREMIUM",
    price: "$149",
    billing: "one-time",
    badge: "MOST SELECTED",
    features: ["Physiological Profiling", "Pace & HR zones (KM based)", "Weekly schedule & Coach notes", "Final Review by Lead Coach"],
  },
  {
    id: "elite",
    level: "Level 03",
    name: "ELITE",
    price: "$99",
    billing: "/ month",
    features: ["Dynamic plan adjustments", "Monthly 1:1 check-ins", "Unlimited email support"],
  },
];

/* ─── Main component ─────────────────────────────────────────── */
export default function IntakePage() {
  const [plan, setPlan]           = useState("");
  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState<FD>(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState("");

  const isTri = TRIATHLON.includes(form.trainingFor);
  const isCyc = CYCLING.includes(form.trainingFor);

  const visible = [
    1, 2, 3,
    ...(isTri ? [4] : []),
    ...(isTri || isCyc ? [5] : []),
    6,
    ...(isTri ? [7] : []),
    8, 9, 10, 11,
  ];

  const total = visible.length;
  const sec   = visible[step];
  const pct   = Math.round(((step + 1) / total) * 100);
  const meta  = META[sec];

  function upd<K extends keyof FD>(k: K, v: FD[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  const selectedPlan = PLANS.find(p => p.id === plan);
  const submitLabel  = selectedPlan
    ? `Pay ${selectedPlan.price} & Submit →`
    : "Pay & Submit →";

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, formData: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "failed");
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again or email admin@planmetric.com.au");
    } finally {
      setSubmitting(false);
    }
  }

  /* ─── Section renderers ──────────────────────────────────── */
  function renderSection() {
    switch (sec) {

      /* ── Section 1: Personal Details ── */
      case 1: return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <F label="Full Name *">
              <TextInput value={form.fullName} onChange={v => upd("fullName", v)} placeholder="Your full name" />
            </F>
            <F label="Email *">
              <TextInput value={form.email} onChange={v => upd("email", v)} type="email" placeholder="you@email.com" />
            </F>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <F label="Age *" note="Exact — used for zone calculations">
              <TextInput value={form.age} onChange={v => upd("age", v)} type="number" placeholder="32" />
            </F>
            <F label="Gender *">
              <SelectInput value={form.gender} onChange={v => upd("gender", v)} options={["Male", "Female", "Non-binary", "Prefer not to say"]} />
            </F>
            <F label="Height (cm) *">
              <TextInput value={form.height} onChange={v => upd("height", v)} type="number" placeholder="175" />
            </F>
            <F label="Weight (kg) *">
              <TextInput value={form.weight} onChange={v => upd("weight", v)} type="number" placeholder="72" />
            </F>
          </div>
          <F label="Location (city, country) *" note="Used for weather and terrain considerations">
            <TextInput value={form.location} onChange={v => upd("location", v)} placeholder="e.g. Brisbane, Australia" />
          </F>
        </div>
      );

      /* ── Section 2: Race & Goal ── */
      case 2: {
        const showTarget = ["Hit a target time", "Podium", "Qualify for championships"].includes(form.mainGoal);
        const showPrev   = form.completedRaceBefore === "Yes";
        return (
          <div className="space-y-6">
            <F label="What are you training for? *">
              <SelectInput value={form.trainingFor} onChange={v => upd("trainingFor", v)}
                options={["Sprint Triathlon", "Olympic Triathlon", "70.3 Ironman", "Full Ironman", "Marathon", "Half Marathon", "Ultra Marathon", "10K", "5K", "Cycling Event", "Other"]} />
            </F>
            <F label="Race name and location" note="Optional — e.g. Noosa Tri, QLD">
              <TextInput value={form.raceName} onChange={v => upd("raceName", v)} placeholder="e.g. Challenge Roth, Germany" />
            </F>
            <F label="Race date *" note="Exact date — used to calculate your plan length">
              <TextInput value={form.raceDate} onChange={v => upd("raceDate", v)} type="date" />
            </F>
            <F label="What is your main goal? *">
              <SelectInput value={form.mainGoal} onChange={v => upd("mainGoal", v)}
                options={["Just finish", "Finish strong", "Hit a target time", "Podium", "Qualify for championships"]} />
            </F>
            {showTarget && (
              <F label="Target finish time *" note='e.g. "Sub 5 hours" or "3:30 marathon"'>
                <TextInput value={form.targetTime} onChange={v => upd("targetTime", v)} placeholder="e.g. Sub 5:00" />
              </F>
            )}
            <F label="Have you completed a race at or longer than this distance before? *">
              <SelectInput value={form.completedRaceBefore} onChange={v => upd("completedRaceBefore", v)} options={["Yes", "No"]} />
            </F>
            {showPrev && (
              <F label="Most recent finish time at that distance" note='e.g. "5:15 for 70.3" or "3:45 marathon"'>
                <TextInput value={form.previousFinishTime} onChange={v => upd("previousFinishTime", v)} placeholder="e.g. 5:15 for 70.3" />
              </F>
            )}
          </div>
        );
      }

      /* ── Section 3: Current Fitness ── */
      case 3: return (
        <div className="space-y-6">
          <F label="How long have you been training consistently? *">
            <SelectInput value={form.trainingConsistency} onChange={v => upd("trainingConsistency", v)}
              options={["< 3 months", "3–6 months", "6–12 months", "1–2 years", "2+ years"]} />
          </F>
          <F label="Most recent race result *" note='e.g. "2:35 Olympic Tri" or "52 min 10K". Write "No recent race" if none.'>
            <TextInput value={form.recentRaceResult} onChange={v => upd("recentRaceResult", v)} placeholder='e.g. "52 min 10K"' />
          </F>
          {isTri && (
            <F label="Individual split times from that race *" note='e.g. "Swim 28:00 / T1 3:00 / Bike 1:12 / T2 2:00 / Run 50:00"'>
              <TextInput value={form.splitTimes} onChange={v => upd("splitTimes", v)} placeholder="Swim / T1 / Bike / T2 / Run" />
            </F>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <F label="Max heart rate (BPM)">
              <div className="space-y-2">
                <TextInput value={form.maxHR} onChange={v => upd("maxHR", v)} type="number" placeholder="e.g. 185" disabled={form.maxHRUnknown} />
                <Checkbox checked={form.maxHRUnknown} onChange={v => upd("maxHRUnknown", v)} label="I don't know" />
              </div>
            </F>
            <F label="Resting heart rate (BPM)">
              <div className="space-y-2">
                <TextInput value={form.restingHR} onChange={v => upd("restingHR", v)} type="number" placeholder="e.g. 52" disabled={form.restingHRUnknown} />
                <Checkbox checked={form.restingHRUnknown} onChange={v => upd("restingHRUnknown", v)} label="I don't know" />
              </div>
            </F>
          </div>
        </div>
      );

      /* ── Section 4: Swim (triathlon only) ── */
      case 4: return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <F label="Easy swim pace (min:sec / 100m)" note='e.g. "2:20"'>
              <TextInput value={form.swimPaceEasy} onChange={v => upd("swimPaceEasy", v)} placeholder="2:20" />
            </F>
            <F label="Threshold swim pace (min:sec / 100m)" note='e.g. "1:55"'>
              <TextInput value={form.swimPaceHard} onChange={v => upd("swimPaceHard", v)} placeholder="1:55" />
            </F>
          </div>
          <F label="Current weekly swim volume *">
            <SelectInput value={form.weeklySwimVolume} onChange={v => upd("weeklySwimVolume", v)}
              options={["Not swimming", "1–2 km", "2–4 km", "4–6 km", "6+ km"]} />
          </F>
          <F label="Longest continuous swim in last 4 weeks (metres) *" note="Determines where race-distance building starts">
            <TextInput value={form.longestSwim} onChange={v => upd("longestSwim", v)} type="number" placeholder="e.g. 1500" />
          </F>
          <F label="Bilateral breathing (every 3 strokes)? *">
            <SelectInput value={form.bilateralBreathing} onChange={v => upd("bilateralBreathing", v)} options={["Yes", "No", "Learning"]} />
          </F>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <F label="Pool access *">
              <SelectInput value={form.poolAccess} onChange={v => upd("poolAccess", v)} options={["Year-round", "Seasonal", "No access"]} />
            </F>
            <F label="Open water access *">
              <SelectInput value={form.openWaterAccess} onChange={v => upd("openWaterAccess", v)} options={["Yes — easy access", "Yes — but limited", "No"]} />
            </F>
            <F label="Wetsuit? *">
              <SelectInput value={form.wetsuit} onChange={v => upd("wetsuit", v)} options={["Yes", "No"]} />
            </F>
          </div>
        </div>
      );

      /* ── Section 5: Bike ── */
      case 5: return (
        <div className="space-y-6">
          <F label="Average speed on a 1hr+ ride (km/h) *" note="Your realistic sustained pace, not max effort">
            <TextInput value={form.avgBikeSpeed} onChange={v => upd("avgBikeSpeed", v)} type="number" placeholder="e.g. 30" />
          </F>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <F label="Current weekly bike volume *" note='e.g. "80km" or "4 hours"'>
              <TextInput value={form.weeklyBikeVolume} onChange={v => upd("weeklyBikeVolume", v)} placeholder="e.g. 80km" />
            </F>
            <F label="Longest ride in last 4 weeks *" note='e.g. "90km" or "3.5 hours"'>
              <TextInput value={form.longestRide} onChange={v => upd("longestRide", v)} placeholder="e.g. 90km" />
            </F>
          </div>
          <F label="FTP (Functional Threshold Power) — watts" note="Leave blank if no power meter">
            <div className="space-y-2">
              <TextInput value={form.ftp} onChange={v => upd("ftp", v)} type="number" placeholder="e.g. 240 watts" disabled={form.ftpUnknown} />
              <Checkbox checked={form.ftpUnknown} onChange={v => upd("ftpUnknown", v)} label="No power meter / don't know" />
            </div>
          </F>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <F label="Bike type *">
              <SelectInput value={form.bikeType} onChange={v => upd("bikeType", v)} options={["Road bike", "TT/Tri bike", "Hybrid", "Mountain bike", "Gravel"]} />
            </F>
            <F label="Power meter? *">
              <SelectInput value={form.powerMeter} onChange={v => upd("powerMeter", v)} options={["Yes", "No"]} />
            </F>
            <F label="Indoor trainer? *">
              <SelectInput value={form.indoorTrainer} onChange={v => upd("indoorTrainer", v)} options={["Yes", "No"]} />
            </F>
          </div>
        </div>
      );

      /* ── Section 6: Run ── */
      case 6: return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <F label="Current weekly running distance (km) *">
              <TextInput value={form.weeklyRunDistance} onChange={v => upd("weeklyRunDistance", v)} type="number" placeholder="e.g. 35" />
            </F>
            <F label="Longest run in last 4 weeks (km) *">
              <TextInput value={form.longestRun} onChange={v => upd("longestRun", v)} type="number" placeholder="e.g. 18" />
            </F>
          </div>
          <F label="Current easy run pace (min:sec per km) *" note='e.g. "5:45" — sets your Zone 2 run targets'>
            <TextInput value={form.easyRunPace} onChange={v => upd("easyRunPace", v)} placeholder="5:45" />
          </F>
          <F label="Recent standalone run race time" note='e.g. "5K in 22:30" or "Half marathon 1:48". Write "N/A" if none.'>
            <TextInput value={form.recentRunRace} onChange={v => upd("recentRunRace", v)} placeholder='e.g. "5K in 22:30"' />
          </F>
          <F label="Treadmill access? *">
            <SelectInput value={form.treadmillAccess} onChange={v => upd("treadmillAccess", v)} options={["Yes", "No"]} />
          </F>
        </div>
      );

      /* ── Section 7: Discipline Ranking ── */
      case 7: return (
        <div className="space-y-6">
          <InfoBox
            title="Why this matters"
            body="Your weakest discipline gets 35% of training volume. Your strongest gets 25% (maintenance only). This balance is the core of your plan structure."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <F label="Your WEAKEST discipline *">
              <SelectInput value={form.weakestDiscipline} onChange={v => upd("weakestDiscipline", v)} options={["Swim", "Bike", "Run"]} />
            </F>
            <F label="Your STRONGEST discipline *">
              <SelectInput value={form.strongestDiscipline} onChange={v => upd("strongestDiscipline", v)} options={["Swim", "Bike", "Run"]} />
            </F>
          </div>
        </div>
      );

      /* ── Section 8: Schedule ── */
      case 8: {
        const showCombos = ["Yes", "Sometimes"].includes(form.doubleDays);
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <F label="Training days per week *">
                <SelectInput value={form.trainingDaysPerWeek} onChange={v => upd("trainingDaysPerWeek", v)} options={["3", "4", "5", "6", "7"]} />
              </F>
              <F label="Rest days per week *">
                <SelectInput value={form.restDaysPerWeek} onChange={v => upd("restDaysPerWeek", v)} options={["1", "2", "3"]} />
              </F>
              <F label="Double days? *" note="Two sessions in one day">
                <SelectInput value={form.doubleDays} onChange={v => upd("doubleDays", v)} options={["Yes", "No", "Sometimes"]} />
              </F>
            </div>
            <F label="Preferred training times *">
              <MultiSelect selected={form.preferredTimes} onChange={v => upd("preferredTimes", v)}
                options={["Before 6am", "6–8am", "Lunch (11am–1pm)", "Afternoon (3–5pm)", "Evening (5–8pm)"]} />
            </F>
            <F label="Days consistently available *">
              <MultiSelect selected={form.availableDays} onChange={v => upd("availableDays", v)}
                options={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} />
            </F>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <F label="Max session — weekdays *">
                <SelectInput value={form.maxWeekdaySession} onChange={v => upd("maxWeekdaySession", v)}
                  options={["30 min", "45 min", "60 min", "75 min", "90 min", "2 hours"]} />
              </F>
              <F label="Max session — weekends *">
                <SelectInput value={form.maxWeekendSession} onChange={v => upd("maxWeekendSession", v)}
                  options={["1 hour", "90 min", "2 hours", "3 hours", "No limit"]} />
              </F>
            </div>
            {showCombos && (
              <F label="Double-day combos that work for you *">
                <MultiSelect selected={form.doubleDayCombos} onChange={v => upd("doubleDayCombos", v)}
                  options={["AM swim + PM run", "AM ride + PM swim", "AM run + PM swim", "AM ride + PM run", "Any combo"]} />
              </F>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <F label="Preferred long session day *">
                <SelectInput value={form.preferredLongDay} onChange={v => upd("preferredLongDay", v)} options={["Saturday", "Sunday", "Either"]} />
              </F>
              <F label="Preferred rest day *">
                <SelectInput value={form.preferredRestDay} onChange={v => upd("preferredRestDay", v)}
                  options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Flexible"]} />
              </F>
            </div>
            <F label="Work schedule *">
              <SelectInput value={form.workShifts} onChange={v => upd("workShifts", v)}
                options={["No — standard hours", "Yes — rotating shifts", "Yes — night shifts", "Yes — FIFO or travel-based"]} />
            </F>
            <F label="Weeks you cannot train (holidays, travel)" note='Optional — e.g. "2 weeks in Bali in July" or "None"'>
              <TextareaInput value={form.unavailableWeeks} onChange={v => upd("unavailableWeeks", v)} placeholder='e.g. "2 weeks off in July" or "None"' rows={2} />
            </F>
          </div>
        );
      }

      /* ── Section 9: Equipment ── */
      case 9: return (
        <div className="space-y-6">
          <F label="GPS watch / heart rate monitor *">
            <SelectInput value={form.gpsWatch} onChange={v => upd("gpsWatch", v)} options={["GPS watch + HRM", "GPS watch only", "HRM only", "Neither"]} />
          </F>
          <F label="Gym / strength training access *">
            <SelectInput value={form.gymAccess} onChange={v => upd("gymAccess", v)} options={["Full gym", "Home weights", "Bodyweight only", "None"]} />
          </F>
          <F label="Equipment budget for upgrades *">
            <SelectInput value={form.equipmentBudget} onChange={v => upd("equipmentBudget", v)} options={["None", "Under $200", "$200–500", "$500+"]} />
          </F>
        </div>
      );

      /* ── Section 10: Health & Recovery ── */
      case 10: {
        const hasInjury = form.currentInjuries === "Yes";
        return (
          <div className="space-y-6">
            <F label="Current injuries or physical limitations? *">
              <SelectInput value={form.currentInjuries} onChange={v => upd("currentInjuries", v)} options={["Yes", "No"]} />
            </F>
            {hasInjury && (
              <>
                <F label="Describe your current injury *" note='e.g. "Rolled ankle, 2 weeks old"'>
                  <TextareaInput value={form.injuryDescription} onChange={v => upd("injuryDescription", v)} placeholder="Describe your current injury or limitation..." rows={3} />
                </F>
                <F label="Recurring injury history (past 2 years)" note='e.g. "IT band flares every 3 months" or "None"'>
                  <TextareaInput value={form.injuryHistory} onChange={v => upd("injuryHistory", v)} placeholder="Any recurring issues to plan around?" rows={3} />
                </F>
              </>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <F label="Average sleep per night *">
                <SelectInput value={form.avgSleep} onChange={v => upd("avgSleep", v)}
                  options={["Less than 5 hrs", "5–6 hrs", "6–7 hrs", "7–8 hrs", "8+ hrs"]} />
              </F>
              <F label="Current life stress level *">
                <SelectInput value={form.stressLevel} onChange={v => upd("stressLevel", v)}
                  options={["Low — manageable", "Moderate — some pressure", "High — work or life is very demanding"]} />
              </F>
            </div>
            <F label="Race nutrition experience *">
              <SelectInput value={form.raceNutrition} onChange={v => upd("raceNutrition", v)}
                options={["Yes — tested and dialled", "Yes — but still experimenting", "Never used race nutrition"]} />
            </F>
            <F label="Strength / gym training *">
              <SelectInput value={form.strengthTraining} onChange={v => upd("strengthTraining", v)}
                options={["Yes — regularly (2+ times/week)", "Yes — occasionally", "No"]} />
            </F>
            <F label="Dietary restrictions or allergies" note="Optional — e.g. Vegan, Gluten-free, or None">
              <TextInput value={form.dietaryRestrictions} onChange={v => upd("dietaryRestrictions", v)} placeholder='e.g. "Vegan" or "None"' />
            </F>
          </div>
        );
      }

      /* ── Section 11: Motivation ── */
      case 11: return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <F label="How do you prefer to train? *">
              <SelectInput value={form.trainingPreference} onChange={v => upd("trainingPreference", v)}
                options={["Alone", "With a partner", "In a group", "Mix of all"]} />
            </F>
            <F label="How do you feel about hard sessions? *">
              <SelectInput value={form.intensityFeeling} onChange={v => upd("intensityFeeling", v)}
                options={["Love them — bring it on", "Tolerate them — necessary evil", "Dread them — prefer easy volume"]} />
            </F>
          </div>
          <F label="What has held your training back in the past? *" note='e.g. "Motivation", "Injuries", "Work schedule"'>
            <TextareaInput value={form.trainingBlockers} onChange={v => upd("trainingBlockers", v)} placeholder="Be honest — this helps us plan around your real blockers" rows={3} />
          </F>
          <F label="What motivates you most? *">
            <TextareaInput value={form.motivation} onChange={v => upd("motivation", v)} placeholder='e.g. "Feeling fit", "Racing friends", "Proving something to myself"' rows={3} />
          </F>
          <F label="What does success look like on race day? *" note="This is your voice — it shapes your coach notes">
            <TextareaInput value={form.successDefinition} onChange={v => upd("successDefinition", v)} placeholder="Describe your ideal race day outcome in your own words..." rows={4} />
          </F>
        </div>
      );

      default: return null;
    }
  }

  /* ─── Plan selection screen ─────────────────────────────── */
  if (!plan) {
    return (
      <main className="pt-32 pb-20 min-h-screen px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <span className="font-label text-[10px] text-primary uppercase tracking-widest mb-4 block">Step 0 of {visible.length + 1}</span>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">
              CHOOSE YOUR PLAN
            </h1>
            <p className="font-body text-on-surface-variant">
              Select the plan you want. You will fill out the form first, then pay at the end.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {PLANS.map(p => (
              <div key={p.id} className="relative bg-surface-container-low p-10 flex flex-col justify-between hover:bg-surface-container transition-colors duration-300">
                {p.badge && (
                  <span className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-label tracking-widest uppercase px-3 py-1 rounded-sm">
                    {p.badge}
                  </span>
                )}
                <div>
                  <span className="font-label text-[10px] tracking-widest uppercase text-primary mb-2 block">{p.level}</span>
                  <h2 className="font-headline text-3xl font-bold mb-6">{p.name}</h2>
                  <ul className="space-y-3 mb-10">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-sm">check</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-6">
                    <span className="font-headline text-4xl font-bold">{p.price}</span>
                    <span className="font-label text-xs text-on-surface-variant uppercase ml-2 tracking-widest">{p.billing}</span>
                  </div>
                  <button
                    onClick={() => setPlan(p.id)}
                    className="w-full py-4 font-label text-xs uppercase tracking-widest bg-primary text-on-primary hover:opacity-90 transition-all rounded-sm"
                  >
                    Select {p.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ─── Thank you screen ───────────────────────────────────── */
  if (submitted) {
    return (
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center px-8">
        <div className="max-w-lg text-center">
          <span className="material-symbols-outlined text-primary mb-8 block" style={{ fontSize: "56px", fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <span className="font-label text-[10px] text-primary uppercase tracking-widest mb-4 block">Intake Received</span>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-6">
            Your data is in.
          </h1>
          <p className="font-body text-on-surface-variant text-lg leading-relaxed mb-3">
            Your personalised plan will be delivered within 48 hours.
          </p>
          <p className="font-body text-on-surface-variant">
            Check your email at <span className="text-primary">{form.email}</span> for confirmation.
          </p>
        </div>
      </main>
    );
  }

  /* ─── Main render ────────────────────────────────────────── */
  return (
    <main className="pt-24 pb-20 min-h-screen px-8">
      <div className="max-w-2xl mx-auto">

        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="font-label text-[10px] uppercase tracking-widest text-primary">
              Section {step + 1} of {total}
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              {pct}% complete
            </span>
          </div>
          <div className="w-full h-px bg-surface-container-high">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Section header */}
        <div className="mb-10">
          <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 block">
            {meta.num}
          </span>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {meta.title.toUpperCase()}
          </h1>
          <p className="font-body text-on-surface-variant">
            {meta.sub}
          </p>
        </div>

        {/* Fields */}
        <div className="mb-12">
          {renderSection()}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/10 rounded-sm">
            <p className="font-label text-[10px] text-red-400 uppercase tracking-widest">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-outline-variant/10">
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-20 disabled:pointer-events-none"
          >
            ← Back
          </button>

          {step < total - 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="bg-primary text-on-primary px-8 py-4 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-all rounded-sm"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary text-on-primary px-8 py-4 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-all rounded-sm disabled:opacity-50"
            >
              {submitting ? "Redirecting to payment..." : submitLabel}
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
