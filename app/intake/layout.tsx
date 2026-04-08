import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Your Plan",
  description: "Complete your athlete profile to receive a personalised endurance training plan. Takes about 5 minutes.",
  alternates: { canonical: "/intake" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
