// Consent-gated analytics bootstrap.
//
// Google Tag Manager is NOT loaded eagerly: it would fire before the user
// consents, which is not GDPR-compliant. Instead we inject it here only once
// the user has opted into the "analytics" category.

import { hasConsentFor, onConsentChange } from "./consent";

const GTM_CONTAINER_ID = "GTM-WKKZHMJJ";

let gtmLoaded = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function loadGoogleTagManager(): void {
  if (gtmLoaded || typeof window === "undefined") return;
  if (document.getElementById("gtm-script")) {
    gtmLoaded = true;
    return;
  }
  gtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

  const script = document.createElement("script");
  script.id = "gtm-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);
}

// Call once at app startup. Loads GTM if consent already exists, then keeps
// listening so a later opt-in takes effect without a page reload.
export function initConsentedAnalytics(): void {
  if (hasConsentFor("analytics")) {
    loadGoogleTagManager();
  }
  onConsentChange(() => {
    if (hasConsentFor("analytics")) {
      loadGoogleTagManager();
    }
  });
}
