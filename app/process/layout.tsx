import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How Plan Metric works: fill out your athlete profile, choose your plan, and receive a personalised training plan built for your race and schedule.",
  alternates: { canonical: "/process" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
