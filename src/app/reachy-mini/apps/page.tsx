import type { Metadata } from "next";
import AppsPage from "@/components/reachy/pages/Apps";

export const metadata: Metadata = {
  title: "Reachy Mini Apps",
  description:
    "Browse apps for Reachy Mini - built by the community and by Pollen Robotics. Install them directly from the Reachy Mini desktop app.",
  alternates: { canonical: "/reachy-mini/apps" },
};

export default function ReachyAppsRoute() {
  return <AppsPage />;
}
