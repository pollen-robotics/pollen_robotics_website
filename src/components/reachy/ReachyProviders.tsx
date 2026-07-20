"use client";

import { type ReactNode } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import reachyTheme from "@/theme/reachy";
import { AuthProvider } from "@/context/AuthContext";
import { AppsProvider } from "@/context/AppsContext";
import PollenHeader from "@/components/Header";
import ReachyHeader from "@/components/reachy/Header";
import ReachyFooter from "@/components/reachy/Footer";
import type { AppItem } from "@/lib/apps";

/**
 * Client boundary for the whole /reachy-mini zone. Applies the Reachy MUI
 * theme, seeds the app catalog (JS-only, fetched on the server) and the auth
 * context, and mounts the shared product Header/Footer + cookie banner.
 *
 * The product header overlays a dark hero on every page (marketing pages and
 * the blog, which now share the same PageHero header), so it is transparent by
 * default and turns opaque on scroll.
 */
export default function ReachyProviders({
  initialApps,
  children,
}: {
  initialApps: AppItem[];
  children: ReactNode;
}) {
  const transparent = true;

  return (
    <ThemeProvider theme={reachyTheme}>
      <CssBaseline />
      <AuthProvider>
        <AppsProvider initialApps={initialApps}>
          {/* NB: no `overflowX: hidden` here - a non-visible overflow on this
              tall wrapper would become the scroll container and break
              `position: sticky` for the article TOC. Horizontal overflow is
              already clipped at the root via `html/body { overflow-x: hidden }`
              in the theme's CssBaseline. */}
          <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Shared Pollen strip, floating over the Reachy hero so the video
                shows through; the Reachy product header sits 44px below it. */}
            <PollenHeader active="reachy" overlay transparentAtTop={transparent} />
            <ReachyHeader transparent={transparent} />
            <Box
              component="main"
              sx={{
                flex: 1,
                // Every page overlays its PageHero under the transparent chrome,
                // so the hero owns the top spacing and main needs no offset.
                pt: transparent ? 0 : { xs: "108px", md: "132px" },
              }}
            >
              {children}
            </Box>
            <ReachyFooter />
          </Box>
        </AppsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
