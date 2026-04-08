import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare Plan Metric training plan tiers: Starter, Premium, and Elite. One-time purchase or subscription options for every level of athlete.",
  alternates: { canonical: "/pricing" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
