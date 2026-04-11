"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

const BG = "#0F0F0F";
const CARD = "#161616";
const BORDER = "#2a2a2a";
const TEXT = "#F5F5F0";
const DIM = "rgba(245,245,240,0.45)";
const ACCENT = "#A0522D";
const GREEN = "#2E7D32";
const RED = "#C62828";

interface Submission {
  id: string;
  full_name: string;
  email: string;
  training_for: string;
  race_date: string;
  plan: string;
  status: string;
  generated_plan: string | null;
  created_at: string;
}

type View = "preview" | "edit";
type Status = "loading" | "ready" | "sending" | "sent" | "saving" | "error";

export default function AdminReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [sub, setSub] = useState<Submission | null>(null);
  const [view, setView] = useState<View>("preview");
  const [status, setStatus] = useState<Status>("loading");
  const [editHtml, setEditHtml] = useState("");
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLIFrameElement>(null);
  const editPreviewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/review?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setStatus("error");
        } else {
          setSub(data);
          setEditHtml(data.generated_plan || "");
          setStatus("ready");
        }
      })
      .catch(() => {
        setError("Failed to load submission");
        setStatus("error");
      });
  }, [id]);

  // Write plan HTML into preview iframe
  useEffect(() => {
    if (!previewRef.current || !sub?.generated_plan || view !== "preview") return;
    const doc = previewRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(sub.generated_plan);
      doc.close();
    }
  }, [sub?.generated_plan, view]);

  // Write edited HTML into edit preview iframe (debounced)
  useEffect(() => {
    if (!editPreviewRef.current || view !== "edit") return;
    const timer = setTimeout(() => {
      const doc = editPreviewRef.current?.contentDocument;
      if (doc) {
        doc.open();
        doc.write(editHtml);
        doc.close();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [editHtml, view]);

  async function handleApprove() {
    if (!sub) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/approve-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: sub.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSub(prev => prev ? { ...prev, status: "plan_sent" } : prev);
      setStatus("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
      setStatus("error");
    }
  }

  async function handleSave() {
    if (!sub) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/review", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sub.id, generated_plan: editHtml }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSub(prev => prev ? { ...prev, generated_plan: editHtml } : prev);
      setView("preview");
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
      setStatus("error");
    }
  }

  /* ── Loading ─────────────────────────────────────────────── */
  if (status === "loading") {
    return (
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center" style={{ background: BG, color: TEXT }}>
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
          />
          <p className="font-label text-[10px] uppercase tracking-widest" style={{ color: DIM }}>
            Loading plan...
          </p>
        </div>
      </main>
    );
  }

  /* ── Error ───────────────────────────────────────────────── */
  if (status === "error" && !sub) {
    return (
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center px-8" style={{ background: BG, color: TEXT }}>
        <div className="max-w-lg text-center">
          <h1 className="font-headline text-2xl font-bold mb-4">{error || "Something went wrong"}</h1>
          <p className="font-body" style={{ color: DIM }}>Check the submission ID and try again.</p>
        </div>
      </main>
    );
  }

  if (!sub) return null;

  const alreadySent = sub.status === "plan_sent";
  const noPlan = !sub.generated_plan;

  /* ── Sent confirmation ──────────────────────────────────── */
  if (status === "sent") {
    return (
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center px-8" style={{ background: BG, color: TEXT }}>
        <div className="max-w-lg text-center">
          <span className="mb-8 block" style={{ color: GREEN, fontSize: "56px" }}>&#10003;</span>
          <h1 className="font-headline text-3xl font-bold tracking-tight mb-4">Plan Delivered</h1>
          <p className="font-body text-lg mb-2" style={{ color: DIM }}>
            {sub.full_name}&apos;s plan has been sent to:
          </p>
          <p className="font-label text-sm mb-8" style={{ color: ACCENT }}>{sub.email}</p>
          <p className="font-body text-sm" style={{ color: DIM }}>
            A confirmation copy was sent to admin@planmetric.com.au
          </p>
        </div>
      </main>
    );
  }

  /* ── Main review UI ─────────────────────────────────────── */
  return (
    <main className="pt-28 pb-20 min-h-screen px-4 md:px-8" style={{ background: BG, color: TEXT }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-8">
          <p className="font-label text-[10px] uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
            Admin Review
          </p>
          <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-3">
            {sub.full_name}
          </h1>
          <div className="flex flex-wrap gap-3 text-xs font-label uppercase tracking-wider">
            <span className="px-3 py-1 rounded-sm" style={{ background: ACCENT, color: TEXT }}>
              {sub.plan}
            </span>
            <span className="px-3 py-1 rounded-sm" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              {sub.training_for}
            </span>
            {sub.race_date && (
              <span className="px-3 py-1 rounded-sm" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                Race: {new Date(sub.race_date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
            <span
              className="px-3 py-1 rounded-sm"
              style={{
                background: alreadySent ? GREEN : noPlan ? RED : CARD,
                color: TEXT,
                border: alreadySent || noPlan ? "none" : `1px solid ${BORDER}`,
              }}
            >
              {alreadySent ? "Sent" : noPlan ? "No Plan" : sub.status?.replace("_", " ")}
            </span>
          </div>
        </div>

        {noPlan ? (
          <div className="rounded-sm p-12 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="font-body text-lg" style={{ color: DIM }}>
              No generated plan found for this submission. The plan may still be generating.
            </p>
          </div>
        ) : (
          <>
            {/* ── Action bar ──────────────────────────────── */}
            <div
              className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-sm"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              {view === "preview" ? (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={alreadySent || status === "sending"}
                    className="px-6 py-3 font-label text-xs uppercase tracking-widest font-bold rounded-sm transition-opacity disabled:opacity-40"
                    style={{ background: GREEN, color: TEXT }}
                  >
                    {status === "sending" ? "Sending..." : alreadySent ? "Already Sent" : "Approve & Send to Athlete"}
                  </button>
                  <button
                    onClick={() => setView("edit")}
                    disabled={alreadySent}
                    className="px-6 py-3 font-label text-xs uppercase tracking-widest font-bold rounded-sm transition-opacity disabled:opacity-40"
                    style={{ background: "transparent", color: TEXT, border: `1px solid ${BORDER}` }}
                  >
                    Edit Plan
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={status === "saving"}
                    className="px-6 py-3 font-label text-xs uppercase tracking-widest font-bold rounded-sm"
                    style={{ background: ACCENT, color: TEXT }}
                  >
                    {status === "saving" ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => { setEditHtml(sub.generated_plan || ""); setView("preview"); setStatus("ready"); }}
                    className="px-6 py-3 font-label text-xs uppercase tracking-widest font-bold rounded-sm"
                    style={{ background: "transparent", color: TEXT, border: `1px solid ${BORDER}` }}
                  >
                    Cancel
                  </button>
                </>
              )}

              {status === "error" && error && (
                <p className="font-label text-xs ml-auto" style={{ color: RED }}>{error}</p>
              )}
            </div>

            {/* ── Plan view ───────────────────────────────── */}
            {view === "preview" ? (
              <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <iframe
                  ref={previewRef}
                  title="Plan Preview"
                  className="w-full border-0"
                  style={{ height: "80vh", background: "#F0E6D4" }}
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ height: "80vh" }}>
                <textarea
                  value={editHtml}
                  onChange={e => setEditHtml(e.target.value)}
                  className="w-full h-full p-4 font-mono text-xs rounded-sm resize-none focus:outline-none"
                  style={{ background: CARD, color: TEXT, border: `1px solid ${BORDER}` }}
                  spellCheck={false}
                />
                <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                  <iframe
                    ref={editPreviewRef}
                    title="Edit Preview"
                    className="w-full h-full border-0"
                    style={{ background: "#F0E6D4" }}
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
