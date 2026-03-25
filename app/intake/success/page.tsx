"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const params    = useSearchParams();
  const sessionId = params.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [email, setEmail]   = useState("");

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    fetch(`/api/intake/verify?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setEmail(data.email || "");
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  /* ── Loading ─────────────────────────────────────────────── */
  if (status === "loading") {
    return (
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center px-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            Confirming payment...
          </p>
        </div>
      </main>
    );
  }

  /* ── Error ───────────────────────────────────────────────── */
  if (status === "error") {
    return (
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center px-8">
        <div className="max-w-lg text-center">
          <span className="material-symbols-outlined text-red-400 mb-8 block" style={{ fontSize: "48px" }}>
            error
          </span>
          <h1 className="font-headline text-3xl font-bold tracking-tight mb-4">
            Something went wrong
          </h1>
          <p className="font-body text-on-surface-variant mb-8">
            We could not confirm your payment. If you were charged, please email us and we will sort it out immediately.
          </p>
          <a
            href="mailto:admin@planmetric.com.au"
            className="bg-primary text-on-primary px-8 py-4 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-all rounded-sm inline-block"
          >
            Email admin@planmetric.com.au
          </a>
        </div>
      </main>
    );
  }

  /* ── Success ─────────────────────────────────────────────── */
  return (
    <main className="pt-32 pb-20 min-h-screen flex items-center justify-center px-8">
      <div className="max-w-lg text-center">
        <span
          className="material-symbols-outlined text-primary mb-8 block"
          style={{ fontSize: "56px", fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <span className="font-label text-[10px] text-primary uppercase tracking-widest mb-4 block">
          Payment confirmed
        </span>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-6">
          Your data is in.
        </h1>
        <p className="font-body text-on-surface-variant text-lg leading-relaxed mb-3">
          Your personalised plan will be delivered within 48 hours.
        </p>
        {email && (
          <p className="font-body text-on-surface-variant mb-10">
            Confirmation sent to <span className="text-primary">{email}</span>
          </p>
        )}
        <Link
          href="/"
          className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors border-b border-outline-variant/30 pb-1"
        >
          Back to Plan Metric
        </Link>
      </div>
    </main>
  );
}

export default function IntakeSuccessPage() {
  return (
    <Suspense fallback={
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
