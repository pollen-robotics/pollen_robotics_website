// Data access for the Reachy Mini app catalog.
//
// The catalog lives in the standalone `reachy_mini_api` Space. We consume its
// `/api/js-apps` projection: the JS-only, already-categorized and moderated
// subset (blocked/hidden entries are filtered server-side). Fetched on the
// server (no CORS, indexable HTML) and revalidated periodically.

export interface AppCardData {
  emoji?: string;
  short_description?: string;
  sdk?: string | null;
  tags?: string[];
}

export interface AppExtra {
  id?: string;
  author?: string;
  likes?: number;
  downloads?: number;
  createdAt?: string | null;
  lastModified?: string | null;
  runtime?: unknown;
  tags?: string[];
  isPythonApp?: boolean;
  sdk?: string | null;
  cardData?: AppCardData;
}

export interface AppItem {
  id: string;
  name: string;
  description?: string;
  url?: string;
  source_kind?: string;
  isOfficial?: boolean;
  isBlocked?: boolean;
  iconUrl?: string | null;
  extra?: AppExtra;
  categories?: string[] | null;
}

const API_BASE =
  process.env.REACHY_API_BASE || "https://pollen-robotics-reachy-mini.hf.space";

// Revalidate window (seconds). Aligned with the API's own 5-minute server-side
// cache TTL so we never serve staler data than the backend itself holds.
const REVALIDATE_SECONDS = 300;

export async function fetchJsApps(): Promise<AppItem[]> {
  try {
    // On the static export (GitHub Pages) the data is fetched once at build
    // time; on the Space we use ISR aligned with the API's own 5-min cache.
    const fetchOpts: RequestInit =
      process.env.STATIC_EXPORT === "1"
        ? { cache: "force-cache" }
        : { next: { revalidate: REVALIDATE_SECONDS } };
    const res = await fetch(`${API_BASE}/api/js-apps`, fetchOpts);
    if (!res.ok) {
      console.error(`[apps] /api/js-apps returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    const apps: AppItem[] = Array.isArray(data?.apps) ? data.apps : [];

    // Deterministic default order: official first, then most recently updated.
    // (Likes are intentionally ignored - the site no longer surfaces them.)
    apps.sort((a, b) => {
      if (Boolean(a.isOfficial) !== Boolean(b.isOfficial)) {
        return a.isOfficial ? -1 : 1;
      }
      const da = a.extra?.lastModified
        ? new Date(a.extra.lastModified).getTime()
        : 0;
      const db = b.extra?.lastModified
        ? new Date(b.extra.lastModified).getTime()
        : 0;
      return db - da;
    });

    return apps;
  } catch (err) {
    console.error("[apps] failed to fetch /api/js-apps:", err);
    return [];
  }
}
