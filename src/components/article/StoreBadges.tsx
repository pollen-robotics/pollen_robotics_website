import { Box } from "@mui/material";

/**
 * Official "Download on the App Store" / "Get it on Google Play" badges,
 * matched by height and centered. Renders only the stores whose URL is
 * provided. Usage:
 *   <StoreBadges appStore="https://apps.apple.com/app/idXXXXXXXXX"
 *                googlePlay="https://play.google.com/store/apps/details?id=..." />
 */
export default function StoreBadges({
  appStore,
  googlePlay,
  height = 46,
  card = false,
}: {
  appStore?: string;
  googlePlay?: string;
  height?: number;
  card?: boolean;
}) {
  const badges: { href: string; src: string; alt: string }[] = [];
  if (appStore) {
    badges.push({
      href: appStore,
      src: "/assets/badges/app-store.svg",
      alt: "Download on the App Store",
    });
  }
  if (googlePlay) {
    badges.push({
      href: googlePlay,
      src: "/assets/badges/google-play.svg",
      alt: "Get it on Google Play",
    });
  }
  if (badges.length === 0) return null;

  const row = (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
      }}
    >
      {badges.map((b) => (
        <Box
          key={b.href}
          component="a"
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={b.alt}
          sx={{
            display: "inline-flex",
            borderRadius: "9px",
            border: "1px solid var(--article-border)",
            transition: "opacity 0.15s ease",
            "&:hover": { opacity: 0.85 },
          }}
        >
          <Box
            component="img"
            src={b.src}
            alt={b.alt}
            sx={{ display: "block", height: `${height}px`, width: "auto" }}
          />
        </Box>
      ))}
    </Box>
  );

  if (card) {
    return (
      <Box
        sx={{
          my: 3,
          px: 2,
          py: { xs: 3, sm: 4 },
          borderRadius: "12px",
          border: "1px solid var(--article-border)",
          bgcolor: "var(--article-surface)",
        }}
      >
        {row}
      </Box>
    );
  }

  return <Box sx={{ my: 3 }}>{row}</Box>;
}
