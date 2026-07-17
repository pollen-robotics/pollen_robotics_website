import type { Metadata } from "next";
import Buy from "@/components/reachy/pages/Buy";

export const metadata: Metadata = {
  title: "Buy Reachy Mini",
  description:
    "Buy Reachy Mini or Reachy Mini Lite - an open-source expressive companion robot kit. Compare versions, see what's in the box, and order online.",
  alternates: { canonical: "/reachy-mini/buy" },
};

export default function ReachyBuyRoute() {
  return <Buy />;
}
