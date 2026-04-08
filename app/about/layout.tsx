import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Plan Metric builds personalised endurance training plans for triathletes, runners, and cyclists. Every plan is built on data and reviewed by humans.",
  alternates: { canonical: "/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
