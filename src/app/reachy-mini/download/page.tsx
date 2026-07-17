import type { Metadata } from "next";
import Download from "@/components/reachy/pages/Download";

export const metadata: Metadata = {
  title: "Download Reachy Mini Control",
  description:
    "Download the official Reachy Mini Control desktop app for macOS, Windows, and Linux. Control, program, and play with your Reachy Mini.",
  alternates: { canonical: "/reachy-mini/download" },
};

export default function ReachyDownloadRoute() {
  return <Download />;
}
