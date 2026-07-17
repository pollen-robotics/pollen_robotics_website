import ZoneProvider from "@/components/ZoneProvider";
import Header from "@/components/Header";

export default function PollenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ZoneProvider zone="pollen">
      <Header active="pollen" />
      {children}
    </ZoneProvider>
  );
}
