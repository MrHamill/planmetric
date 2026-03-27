"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import IntakePage from "@/app/intake/page";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan") as "premium" | "elite" | null;
  const [stravaMessage, setStravaMessage] = useState(false);

  return (
    <div>
      {/* Header banner image */}
      <div className="relative pt-24 overflow-hidden" style={{ borderRadius: "0 0 12px 12px" }}>
        <img
          src="/images/pool-ready.png"
          alt="Swimmer in pool gripping edge, looking at camera"
          className="w-full max-h-[250px] object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(240,230,212,0.6)" }} />
      </div>

      {/* Strava Connect Banner */}
      <div className="pt-8 pb-8 px-8 md:px-24 max-w-4xl mx-auto">
        <div className="bg-surface-container p-6 rounded-sm border border-outline/18 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
              Connect your training data
            </h3>
            <p className="font-body text-sm text-on-surface-variant">
              Import your activity history for a more accurate plan.
            </p>
          </div>
          <button
            onClick={() => setStravaMessage(true)}
            className="bg-[#FC4C02] text-white px-6 py-3 text-xs font-bold tracking-widest rounded-sm hover:bg-[#E34402] transition-all uppercase whitespace-nowrap flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            Connect with Strava
          </button>
        </div>
        {stravaMessage && (
          <div className="mt-4 bg-surface-container-low p-4 rounded-sm border border-primary/20 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              <span className="text-primary font-bold">Coming soon</span> &mdash; Strava integration launching shortly.
            </p>
          </div>
        )}
      </div>

      {/* Intake Form — pass pre-selected plan to skip plan selection */}
      <IntakePage preSelectedPlan={planFromUrl || undefined} />
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense>
      <AssessmentContent />
    </Suspense>
  );
}
