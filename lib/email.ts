import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY env var");
  }

  try {
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      throw new Error(error.message);
    }
  } catch (err) {
    console.error(`Email error sending to ${to}:`, err);
    throw err;
  }
}
