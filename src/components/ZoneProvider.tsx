"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import reachyTheme from "@/theme/reachy";
import reachy2Theme from "@/theme/reachy2";
import pollenTheme from "@/theme/pollen";

export type Zone = "pollen" | "reachy" | "reachy2";

const THEMES = {
  pollen: pollenTheme,
  reachy: reachyTheme,
  reachy2: reachy2Theme,
} as const;

// Client-side theme boundary. Each zone layout picks a theme by name (a plain
// string, so nothing non-serializable crosses the RSC boundary) and the actual
// MUI theme object is resolved here, inside the client bundle.
export default function ZoneProvider({
  zone,
  children,
}: {
  zone: Zone;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={THEMES[zone]}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
