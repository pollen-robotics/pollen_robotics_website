// GDPR-compliant cookie consent management.
//
// Design goals:
// - No non-essential scripts (e.g. Google Tag Manager) run before opt-in.
// - "Necessary" category is always on (strictly required for the site to work).
// - Choices are versioned so we can re-ask consent when the policy changes.
// - Consent can be read, updated and withdrawn at any time.

const STORAGE_KEY = "rm_cookie_consent";

// Bump this when the cookie policy or categories change to re-prompt users.
export const CONSENT_VERSION = 1;

export interface ConsentCategory {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

export type ConsentMap = Record<string, boolean>;

interface ConsentRecord {
  version: number;
  timestamp: string;
  categories: ConsentMap;
}

// Categories shown to the user. `necessary` is locked on and cannot be refused.
export const CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: "necessary",
    label: "Strictly necessary",
    description:
      "Required for the website to function (e.g. remembering your cookie choices). Cannot be disabled.",
    required: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description:
      "Helps us understand how the site is used so we can improve it (Google Tag Manager). Privacy-friendly, cookieless analytics may still run.",
    required: false,
  },
];

const EVENT_NAME = "rm:consent-change";

function defaultConsent(): ConsentMap {
  return CONSENT_CATEGORIES.reduce<ConsentMap>((acc, c) => {
    acc[c.id] = !!c.required;
    return acc;
  }, {});
}

// Returns the stored consent record, or null if the user has never chosen
// (or if the stored version is outdated and must be re-collected).
export function getStoredConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasMadeChoice(): boolean {
  return getStoredConsent() !== null;
}

// Returns the current per-category consent map (necessary always true).
export function getConsent(): ConsentMap {
  const stored = getStoredConsent();
  if (!stored) return defaultConsent();
  return { ...defaultConsent(), ...stored.categories };
}

export function hasConsentFor(categoryId: string): boolean {
  return !!getConsent()[categoryId];
}

// Persists the user's choice and notifies listeners (analytics loaders, UI...).
export function saveConsent(categories: ConsentMap): ConsentRecord {
  const normalized = { ...defaultConsent(), ...categories };
  // `necessary` is enforced regardless of input.
  normalized.necessary = true;

  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories: normalized,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage unavailable (private mode, etc.) - choice just won't persist.
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: record }));
  }
  return record;
}

export function acceptAll(): ConsentRecord {
  return saveConsent(
    CONSENT_CATEGORIES.reduce<ConsentMap>((acc, c) => {
      acc[c.id] = true;
      return acc;
    }, {})
  );
}

export function rejectAll(): ConsentRecord {
  return saveConsent(defaultConsent());
}

// Clears the stored choice so the banner is shown again.
export function resetConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
  }
}

// Subscribe to consent changes. Returns an unsubscribe function.
export function onConsentChange(
  callback: (detail: ConsentRecord | null) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => callback((e as CustomEvent).detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

// Custom event other components can dispatch to (re)open the preferences UI.
export const OPEN_PREFERENCES_EVENT = "rm:open-cookie-preferences";

export function openCookiePreferences(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
  }
}
