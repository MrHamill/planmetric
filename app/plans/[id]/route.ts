import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/* ─── GET /plans/[id] ────────────────────────────────────────────
   Serves the full interactive plan HTML for a paid submission.
   Adds a floating download button via injected script.
   ────────────────────────────────────────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { data: sub } = await supabase
    .from("intake_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!sub) {
    return new NextResponse(notFoundPage("Plan not found"), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (sub.status === "pending_payment") {
    return new NextResponse(notFoundPage("Payment not yet confirmed"), {
      status: 402,
      headers: { "Content-Type": "text/html" },
    });
  }

  /* ── Determine plan file ───────────────────────────────────── */
  const d = sub.data as Record<string, unknown>;
  const event = String(d.trainingFor || sub.training_for || "").trim();
  const level = String(d.level || "Beginner").trim();
  const slug = `${event.toLowerCase().replace(/\s+/g, "-")}-${level.toLowerCase()}`;
  const planPath = resolve(process.cwd(), `public/plans/${slug}.html`);

  if (!existsSync(planPath)) {
    return new NextResponse(notFoundPage("Plan file not found"), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  let planHtml = readFileSync(planPath, "utf-8");

  /* ── Inject download button before </body> ─────────────────── */
  const downloadSnippet = `
<style>
.pm-download-btn{position:fixed;bottom:24px;right:24px;z-index:9999;background:#A0522D;color:#F0E6D4;border:none;padding:14px 24px;border-radius:10px;font-family:'Space Grotesk','Inter',system-ui,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.05em;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.2);display:flex;align-items:center;gap:8px;transition:all 0.2s}
.pm-download-btn:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(0,0,0,0.3)}
.pm-download-btn svg{width:18px;height:18px;fill:currentColor}
</style>
<button class="pm-download-btn" onclick="(function(){var a=document.createElement('a');a.href='data:text/html;charset=utf-8,'+encodeURIComponent(document.documentElement.outerHTML);a.download='${slug}.html';a.click()})()">
  <svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm7-18v12.17l3.59-3.58L17 12l-5 5-5-5 1.41-1.41L12 14.17V2z"/></svg>
  Download Plan
</button>
`;

  planHtml = planHtml.replace("</body>", downloadSnippet + "</body>");

  return new NextResponse(planHtml, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "private, max-age=3600",
    },
  });
}

function notFoundPage(message: string): string {
  return `<!DOCTYPE html>
<html>
<body style="background:#F0E6D4;color:#1C1614;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
  <div style="text-align:center;max-width:400px;padding:40px;">
    <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#A0522D;margin-bottom:16px;">Plan Metric</p>
    <h1 style="font-size:24px;margin-bottom:12px;">${message}</h1>
    <p style="color:#3A2E28;margin-bottom:24px;">If you believe this is an error, please contact us.</p>
    <a href="mailto:admin@planmetric.com.au" style="color:#A0522D;text-decoration:underline;">admin@planmetric.com.au</a>
  </div>
</body>
</html>`;
}
