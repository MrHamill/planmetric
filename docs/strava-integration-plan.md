# Strava Integration Plan

## Goal

Add a "Connect Strava for more accuracy" option to the intake form. When connected, pull the athlete's last 4-6 weeks of training data to auto-populate fitness metrics and feed real data into the AI plan generation prompt.

## Why

Athletes self-report their fitness inaccurately. Strava data gives us actual HR zones, weekly volume, pace ranges, and training consistency — leading to significantly better personalised plans.

## User Flow

```
Intake form (step ~3-4) → "Want to connect Strava for more accuracy?" toggle
  → Yes → "Connect with Strava" button
  → Redirects to Strava OAuth consent screen
  → User approves → Redirects back to intake with auth code
  → Backend exchanges code for access token
  → Fetches last 6 weeks of activities
  → Processes into metrics (HR zones, volume, paces, split)
  → Auto-fills relevant intake fields OR stores as supplementary data
  → Continue with rest of intake as normal
```

## What We Pull From Strava

From GET `/athlete/activities` (last 6 weeks):

- **Heart rate data** — max HR, average HR per activity, zone distribution
- **Weekly volume** — total hours and km per week, broken down by sport
- **Pace/power ranges** — easy pace, threshold, race pace (from effort analysis)
- **Training split** — swim/bike/run ratio (hours and distance)
- **Consistency** — sessions per week, rest day patterns
- **Activity types** — Run, Ride, Swim, WeightTraining, etc.

## Technical Implementation

### 1. Register Strava App

- Go to https://www.strava.com/settings/api
- App name: Plan Metric
- Callback domain: planmetric.com.au (and localhost for dev)
- Get Client ID and Client Secret
- Add to `.env.local`: `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`

### 2. New API Routes

**`/api/strava/auth` (GET)** — Redirects user to Strava OAuth
- Builds Strava authorize URL with scope `read,activity:read`
- Includes `state` param with a token to prevent CSRF
- Includes `redirect_uri` pointing to callback route

**`/api/strava/callback` (GET)** — Handles OAuth return
- Receives `code` and `state` params
- Exchanges code for access token via POST to `https://www.strava.com/oauth/token`
- Fetches last 6 weeks of activities using the token
- Processes activities into metrics
- Stores processed metrics in a short-lived session/cookie or query param
- Redirects back to intake form

**`/api/strava/activities` (alternative)** — If we want to separate the fetch
- Takes access token, fetches and processes activities
- Returns JSON metrics to the frontend

### 3. Activity Processing Logic

Create `lib/strava.ts` with:

```typescript
// Types
interface StravaActivity {
  type: string;           // Run, Ride, Swim, WeightTraining
  distance: number;       // meters
  moving_time: number;    // seconds
  elapsed_time: number;   // seconds
  average_heartrate?: number;
  max_heartrate?: number;
  average_speed: number;  // m/s
  start_date: string;     // ISO date
  sport_type: string;     // more granular than type
}

interface StravaMetrics {
  weeklyVolume: { swim: number; bike: number; run: number; total: number }; // hours
  weeklyDistance: { swim: number; bike: number; run: number }; // km
  sessionsPerWeek: number;
  maxHR: number | null;
  avgHR: number | null;
  paceRanges: { easy: string; threshold: string; } | null;
  sportSplit: { swim: number; bike: number; run: number }; // percentage
  consistency: string; // "high" | "moderate" | "low"
}

// Processing function
function processActivities(activities: StravaActivity[]): StravaMetrics { ... }
```

### 4. Intake Form Changes

In `app/intake/page.tsx`:

- Add a toggle/question around step 3-4: "Do you want to connect Strava for more accuracy?"
- If yes, show a "Connect with Strava" button (use official Strava brand button — orange "Connect with Strava")
- On return from OAuth, read the processed metrics
- Auto-fill fields like max HR, weekly training hours, current fitness indicators
- Show a summary: "We found X activities over the last 6 weeks: ~Y hrs/week, max HR of Z"
- Store the full Strava metrics in the form data JSON blob

### 5. Plan Generation Prompt Enhancement

In `/api/generate-plan/route.ts`, add a Strava section to the Claude prompt:

```
## Strava Training Data (Last 6 Weeks)
- Weekly volume: X hours (Swim: Xh, Bike: Xh, Run: Xh)
- Sessions per week: X
- Max HR observed: X bpm
- Avg HR across easy runs: X bpm
- Run paces: Easy X:XX/km, Threshold X:XX/km
- Training consistency: high/moderate/low
- Sport split: X% swim, X% bike, X% run

Use this data to set accurate training zones and starting volume.
Do not exceed their current weekly volume by more than 10% in week 1.
```

### 6. Database

No schema changes needed. Store Strava metrics inside the existing `data` JSONB column:

```json
{
  "fullName": "...",
  "stravaConnected": true,
  "stravaMetrics": { ... },
  ...other form fields
}
```

## What We Don't Need

- No user accounts or login system
- No ongoing Strava connection or webhooks
- No dashboard or activity tracking
- No token refresh (one-time use during intake)
- No Garmin integration (future phase)

## Strava API Limits

- 200 requests per 15 minutes, 2,000 per day
- One user connecting = ~2 API calls (token exchange + fetch activities)
- More than enough for intake volume

## Strava Brand Guidelines

- Must use official "Connect with Strava" button assets
- Must display "Powered by Strava" where data is shown
- Download assets from https://developers.strava.com/guidelines/

## Build Order

1. Register Strava app, get credentials, add env vars
2. Create `lib/strava.ts` with types and processing logic
3. Create `/api/strava/auth` and `/api/strava/callback` routes
4. Add the Strava toggle + button to the intake form
5. Wire up the return flow — read metrics, show summary, store in form data
6. Update the plan generation prompt to include Strava data
7. Test end-to-end with a real Strava account
