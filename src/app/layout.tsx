import type { Metadata } from "next";
import { DM_Sans, Fredoka } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import GlobalCookieConsent from "@/components/GlobalCookieConsent";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pollen-robotics.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pollen Robotics",
    template: "%s | Pollen Robotics",
  },
  description:
    "Pollen Robotics designs expressive, open-source robots - hardware, software, and everything in between.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fredoka.variable}`}>
      <body>
        <AppRouterCacheProvider options={{ key: "mui" }}>
          {children}
          <GlobalCookieConsent />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
