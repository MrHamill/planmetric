"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";

export default function PlanViewer() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<{ name: string; training_for: string; html: string } | null>(null);
  const [error, setError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/plan/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setPlan)
      .catch(() => setError(true));
  }, [id]);

  const handleDownload = useCallback(() => {
    if (!plan) return;
    const blob = new Blob([plan.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${plan.name.replace(/\s+/g, "-")}-${plan.training_for.replace(/\s+/g, "-")}-Plan.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [plan]);

  const handlePrint = useCallback(() => {
    iframeRef.current?.contentWindow?.print();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-8">
        <div className="text-center">
          <h1 className="font-headline text-2xl text-on-surface mb-3">Plan Not Found</h1>
          <p className="font-body text-on-surface-variant">
            This plan link may be invalid or expired. Please contact us at{" "}
            <a href="mailto:admin@planmetric.com.au" className="text-primary underline">
              admin@planmetric.com.au
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-label text-sm text-on-surface-variant tracking-widest uppercase">Loading plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Action bar ──────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-surface-container/92 backdrop-blur-md border-b border-outline/18">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div>
            <p className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary">Plan Metric</p>
            <p className="font-headline text-sm text-on-surface font-bold">
              {plan.name} &mdash; {plan.training_for}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="bg-primary text-on-primary px-5 py-2 text-xs font-bold tracking-widest rounded-sm hover:bg-primary-dim transition-all uppercase"
            >
              Download
            </button>
            <button
              onClick={handlePrint}
              className="bg-surface-container-high text-on-surface px-5 py-2 text-xs font-bold tracking-widest rounded-sm hover:bg-surface-container-highest transition-all uppercase"
            >
              Print / PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Plan content (iframe for style isolation) ──── */}
      <iframe
        ref={iframeRef}
        srcDoc={plan.html}
        className="w-full border-0"
        style={{ minHeight: "100vh" }}
        onLoad={() => {
          const iframe = iframeRef.current;
          if (iframe?.contentDocument?.body) {
            iframe.style.height = iframe.contentDocument.body.scrollHeight + 100 + "px";
          }
        }}
        title={`${plan.name} Training Plan`}
      />
    </div>
  );
}
