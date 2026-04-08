import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How Plan Metric builds training plans: evidence-based periodisation, the 80/20 intensity rule, personalised zones, and progressive volume loading.",
  alternates: { canonical: "/methodology" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
