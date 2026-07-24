import type { Metadata } from "next";
import Download from "@/components/reachy/pages/Download";

export const metadata: Metadata = {
  title: "Download the Reachy Mini apps",
  description:
    "Get the Reachy Mini mobile app for iOS and Android to set up, talk to, and control your robot - plus the Reachy Mini Control desktop app for macOS, Windows, and Linux.",
  alternates: { canonical: "/reachy-mini/download" },
};

export default function ReachyDownloadRoute() {
  return <Download />;
}
