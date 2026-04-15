import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "pete@mastertradesassociation.com.au",
    pass: "jvzy qigi tocf kcgp",
  },
});

const submissionId = "d1411a2c-2779-4dd5-b30f-05be7c3223d3";
const planUrl = `https://planmetric.com.au/plan/${submissionId}`;
const event = "Marathon";
const level = "Elite";

function buildPlanEmail(name, event, level, planUrl) {
  return `<!DOCTYPE html>
<html>
<body style="background:#F0E6D4;color:#1C1614;font-family:system-ui,-apple-system,sans-serif;padding:0;margin:0;">
  <div style="background:#A0522D;color:#F0E6D4;padding:32px;">
    <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px;">Plan Metric</p>
    <h1 style="font-size:28px;margin:0;font-weight:700;">Your ${event} Plan is Ready</h1>
  </div>
  <div style="padding:40px 32px;max-width:600px;">
    <p style="font-size:16px;line-height:1.7;color:#1C1614;margin:0 0 8px;">
      Hi ${name},
    </p>
    <p style="font-size:16px;line-height:1.7;color:#3A2E28;margin:0 0 32px;">
      Your <strong>${level} ${event}</strong> training plan is ready. Click below to view your full interactive plan — complete with weekly breakdowns, training zones, and session details.
    </p>
    <a href="${planUrl}" style="display:inline-block;background:#A0522D;color:#F0E6D4;padding:16px 32px;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;border-radius:6px;">
      View Your Plan
    </a>
    <p style="font-size:13px;color:#6B5E54;margin:32px 0 0;line-height:1.6;">
      You can also download your plan as an HTML file from the plan page. Bookmark the link above to access it anytime.
    </p>
  </div>
  <div style="background:#1C1614;color:#F0E6D4;padding:24px 32px;font-size:11px;text-align:center;letter-spacing:0.1em;text-transform:uppercase;">
    Plan Metric &middot; planmetric.com.au
  </div>
</body>
</html>`;
}

const from = "Plan Metric <pete@mastertradesassociation.com.au>";

async function main() {
  console.log("Sending plan email to lulu.mathers@griffithuni.edu.au...");
  await transporter.sendMail({
    from,
    to: "lulu.mathers@griffithuni.edu.au",
    subject: `Your ${event} ${level} Plan is Ready — Plan Metric`,
    html: buildPlanEmail("Lulu", event, level, planUrl),
  });
  console.log("Sent to lulu.mathers@griffithuni.edu.au");

  console.log("Sending copy to pete@planmetric.com.au...");
  await transporter.sendMail({
    from,
    to: "pete@planmetric.com.au",
    subject: `Elite Plan Sent: Lulu Mathers — ${event}`,
    html: buildPlanEmail("Lulu Mathers", event, level, planUrl),
  });
  console.log("Sent to pete@planmetric.com.au");

  console.log("Done!");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
