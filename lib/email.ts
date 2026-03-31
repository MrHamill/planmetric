import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
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
  return transporter.sendMail({ from, to, subject, html });
}
