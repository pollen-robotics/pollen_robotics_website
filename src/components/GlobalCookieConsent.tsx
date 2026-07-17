"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import pollenTheme from "@/theme/pollen";
import CookieConsent from "./reachy/CookieConsent";
import { initConsentedAnalytics } from "@/lib/analytics";

/**
 * Site-wide cookie consent. Mounted once at the root so the banner/preferences
 * appear on every zone (Pollen, Reachy), not just Reachy.
 *
 * Wrapped in the Pollen brand theme (no CssBaseline) so the MUI dialog/buttons
 * keep the orange brand styling regardless of the zone, without leaking global
 * baseline styles onto the theme-light Pollen pages.
 */
export default function GlobalCookieConsent() {
  useEffect(() => {
    initConsentedAnalytics();
  }, []);

  return (
    <ThemeProvider theme={pollenTheme}>
      <CookieConsent />
    </ThemeProvider>
  );
}
