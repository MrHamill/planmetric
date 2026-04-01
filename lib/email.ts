import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS?.trim(),
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  from = "Plan Metric <pete@planmetric.com.au>",
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    const missing = [
      !process.env.SMTP_USER && "SMTP_USER",
      !process.env.SMTP_PASS && "SMTP_PASS",
    ].filter(Boolean).join(", ");
    throw new Error(`Missing SMTP env vars: ${missing}`);
  }

  try {
    return await transporter.sendMail({ from, to, subject, html });
  } catch (err) {
    console.error(`SMTP error sending to ${to}:`, err);
    throw err;
  }
}
