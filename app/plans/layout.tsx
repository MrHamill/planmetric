import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Plans",
  description: "Personalised endurance training plans for marathon, triathlon, cycling, and more. Choose from Starter, Premium, or Elite plans tailored to your race and goals.",
  alternates: { canonical: "/plans" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
