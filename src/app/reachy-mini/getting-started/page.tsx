import type { Metadata } from "next";
import GettingStarted from "@/components/reachy/pages/GettingStarted";

export const metadata: Metadata = {
  title: "Getting Started with Reachy Mini",
  description:
    "Assemble, connect, and start playing with your Reachy Mini in 2-3 hours. Follow the step-by-step guide for the Wireless and Lite versions.",
  alternates: { canonical: "/reachy-mini/getting-started" },
};

export default function ReachyGettingStartedRoute() {
  return <GettingStarted />;
}
