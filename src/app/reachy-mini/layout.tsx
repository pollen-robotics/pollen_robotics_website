import ReachyProviders from "@/components/reachy/ReachyProviders";
import { fetchJsApps } from "@/lib/apps";

// The JS-only app catalog is fetched on the server and seeded into the client
// providers, so the whole zone (home apps count + apps grid) ships in the
// initial HTML. On the Space (Node server) we refresh it with ISR every 5 min;
// for the GitHub Pages static export the data is baked in at build time (the CI
// rebuilds periodically to refresh it), so revalidation is disabled there.
export const revalidate = process.env.STATIC_EXPORT === "1" ? false : 300;

export default async function ReachyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apps = await fetchJsApps();
  return <ReachyProviders initialApps={apps}>{children}</ReachyProviders>;
}
