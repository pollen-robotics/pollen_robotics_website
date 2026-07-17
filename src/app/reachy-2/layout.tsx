import ZoneProvider from "@/components/ZoneProvider";
import Header from "@/components/Header";

export default function Reachy2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ZoneProvider zone="reachy2">
      {/* Overlay + transparent so the dark hero passes under the topbar and the
          bar only frosts over once the user scrolls, like the Reachy zone. */}
      <Header active="reachy2" overlay transparentAtTop />
      {children}
    </ZoneProvider>
  );
}
