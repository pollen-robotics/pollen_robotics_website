import type { Metadata } from "next";
import Home from "@/components/reachy/pages/Home";

export const metadata: Metadata = {
  title: "Reachy Mini - Open source expressive companion robot",
  description:
    "Reachy Mini is an expressive, open-source companion robot for human interaction, creative coding, and AI experimentation. Built by Pollen Robotics, powered by Hugging Face.",
  alternates: { canonical: "/reachy-mini" },
};

export default function ReachyHomePage() {
  return <Home />;
}
