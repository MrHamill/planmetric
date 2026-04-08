import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Plan Metric terms of service. Terms and conditions for using our personalised training plan service.",
  alternates: { canonical: "/terms" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
