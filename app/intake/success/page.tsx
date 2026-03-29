"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const BG = "#0F0F0F";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#B85C2C";
const CARD_BORDER = "rgba(245,245,240,0.10)";

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
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center px-8" style={{ background: BG, color: TEXT }}>
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
          />
          <p className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>
            Confirming payment...
          </p>
        </div>
      </main>
    );
  }

  /* ── Error ───────────────────────────────────────────────── */
  if (status === "error") {
    return (
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center px-8" style={{ background: BG, color: TEXT }}>
        <div className="max-w-lg text-center">
          <span className="mb-8 block text-red-400" style={{ fontSize: "48px" }}>
            &#10007;
          </span>
          <h1 className="font-headline text-3xl font-bold tracking-tight mb-4">
            Something went wrong
          </h1>
          <p className="font-body mb-8" style={{ color: DIM }}>
            We could not confirm your payment. If you were charged, please email us and we will sort it out immediately.
          </p>
          <a
            href="mailto:admin@planmetric.com.au"
            className="px-8 py-4 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-all rounded-sm inline-block"
            style={{ background: ACCENT, color: TEXT }}
          >
            Email admin@planmetric.com.au
          </a>
        </div>
      </main>
    );
  }

  /* ── Success ─────────────────────────────────────────────── */
  return (
    <main className="pt-32 pb-20 min-h-screen flex items-center justify-center px-8" style={{ background: BG, color: TEXT }}>
      <div className="max-w-lg text-center">
        <span className="mb-8 block" style={{ color: ACCENT, fontSize: "56px" }}>
          &#10003;
        </span>
        <span className="font-label text-[10px] uppercase tracking-widest mb-4 block" style={{ color: ACCENT }}>
          Payment confirmed
        </span>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-6">
          Your data is in.
        </h1>
        <p className="font-body text-lg leading-relaxed mb-3" style={{ color: DIM }}>
          Your personalised plan will be delivered within 48 hours.
        </p>
        {email && (
          <p className="font-body mb-10" style={{ color: DIM }}>
            Confirmation sent to <span style={{ color: ACCENT }}>{email}</span>
          </p>
        )}
        <Link
          href="/"
          className="font-label text-[10px] uppercase tracking-widest transition-colors pb-1"
          style={{ color: DIM, borderBottom: `1px solid ${CARD_BORDER}` }}
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
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
        />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
