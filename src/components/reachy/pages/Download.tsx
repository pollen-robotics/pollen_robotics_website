"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import ImageWithSpinner from "@/components/ImageWithSpinner";
import StoreBadges from "@/components/article/StoreBadges";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/storeLinks";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";

interface PlatformInfo {
  name: string;
  subtitle: string;
  arch: string;
  format: string;
}

const PLATFORMS: Record<string, PlatformInfo> = {
  "darwin-aarch64": { name: "macOS", subtitle: "Apple Silicon", arch: "M1, M2, M3, M4", format: ".dmg" },
  "windows-x86_64": { name: "Windows", subtitle: "64-bit", arch: "x86_64", format: ".msi" },
  "linux-x86_64": { name: "Linux", subtitle: "Debian/Ubuntu", arch: "x86_64", format: ".deb" },
};

const GITHUB_RELEASES_API =
  "https://api.github.com/repos/pollen-robotics/reachy-mini-desktop-app/releases/latest";

interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  id: number;
  tag_name: string;
  published_at: string;
  html_url: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: GitHubAsset[];
}

interface ReleaseData {
  version: string;
  pub_date: string;
  platforms: Record<string, { url: string }>;
}

function detectPlatform(): string {
  const ua = navigator.userAgent;
  const platform = navigator.platform || "";
  if (/Mac/.test(platform) || /Mac/.test(ua)) return "darwin-aarch64";
  if (/Win/.test(platform) || /Windows/.test(ua)) return "windows-x86_64";
  if (/Linux/.test(platform) || /Linux/.test(ua)) return "linux-x86_64";
  return "darwin-aarch64";
}

function isMobileDevice(): boolean {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function AppleIcon() {
  return <Box component="img" src="/assets/apple-logo.svg" alt="Apple" sx={{ width: 32, height: 32 }} />;
}
function WindowsIcon() {
  return <Box component="img" src="/assets/windows-logo.svg" alt="Windows" sx={{ width: 32, height: 32 }} />;
}
function LinuxIcon() {
  return <Box component="img" src="/assets/linux-logo.svg" alt="Linux" sx={{ width: 32, height: 32 }} />;
}

function getPlatformIcon(platformKey: string) {
  if (platformKey.includes("darwin")) return <AppleIcon />;
  if (platformKey.includes("windows")) return <WindowsIcon />;
  if (platformKey.includes("linux")) return <LinuxIcon />;
  return null;
}

function parseReleasePlatforms(assets?: GitHubAsset[]): Record<string, { url: string }> {
  if (!assets) return {};
  const platforms: Record<string, { url: string }> = {};
  assets.forEach((asset) => {
    const name = asset.name.toLowerCase();
    const url = asset.browser_download_url;
    if (name.endsWith(".sig")) return;
    if (name.includes("arm64.dmg")) {
      platforms["darwin-aarch64"] = { url };
    } else if (name.includes("darwin-aarch64") && !platforms["darwin-aarch64"]) {
      platforms["darwin-aarch64"] = { url };
    }
    if (name.endsWith(".msi")) platforms["windows-x86_64"] = { url };
    if (name.endsWith(".deb")) platforms["linux-x86_64"] = { url };
  });
  return platforms;
}

function PlatformCard({
  platformKey,
  url,
  isActive,
  onClick,
}: {
  platformKey: string;
  url?: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const platform = PLATFORMS[platformKey];
  const isBeta = platformKey.includes("windows") || platformKey.includes("linux");

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        position: "relative",
        background: isActive
          ? "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)"
          : "rgba(255, 255, 255, 0.03)",
        border: "1px solid",
        borderColor: isActive ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(10px)",
        transition: "all 0.25s ease",
        "&:hover": {
          borderColor: isActive ? "rgba(59, 130, 246, 0.6)" : "rgba(255, 255, 255, 0.2)",
          transform: "translateY(-4px)",
          boxShadow: isActive ? "0 12px 40px rgba(59, 130, 246, 0.2)" : "0 12px 40px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      {isBeta && (
        <Chip
          label="Beta"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            color: "#3b82f6",
            fontSize: 10,
            fontWeight: 700,
            height: 20,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      )}

      <CardContent
        component="a"
        href={url}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          textDecoration: "none",
          color: "inherit",
          p: 3,
          "&:last-child": { pb: 3 },
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          }}
        >
          {getPlatformIcon(platformKey)}
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "white", lineHeight: 1.2 }}>
            {platform?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            {platform?.subtitle}
          </Typography>
        </Box>

        <Chip
          label={platform?.format}
          size="small"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "rgba(255,255,255,0.7)",
            fontSize: 11,
            fontWeight: 600,
            height: 24,
          }}
        />
      </CardContent>
    </Card>
  );
}

function PhoneMockup() {
  return (
    <Box
      component="img"
      src="/assets/mobile-app-screenshot.png"
      alt="Reachy Mini mobile app - talk to your robot and give it a custom AI personality"
      sx={{
        display: "block",
        width: "auto",
        maxWidth: "100%",
        maxHeight: { xs: 460, md: 580 },
        borderRadius: 5,
        boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
        flexShrink: 0,
      }}
    />
  );
}

export default function Download() {
  const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDetectedPlatform(detectPlatform());
    setIsMobile(isMobileDevice());

    async function fetchReleases() {
      try {
        const latestResponse = await fetch(GITHUB_RELEASES_API);

        if (latestResponse.ok) {
          const data = (await latestResponse.json()) as GitHubRelease;
          const version = data.tag_name?.replace("v", "") || "";
          const platforms = parseReleasePlatforms(data.assets);
          setReleaseData({ version, pub_date: data.published_at, platforms });
        } else {
          setError("Failed to fetch release info");
        }
      } catch (err) {
        console.error("Error fetching release:", err);
        setError("Failed to fetch release info");
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#000",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  if (error || !releaseData) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#000",
          color: "white",
          gap: 3,
        }}
      >
        <Typography variant="h5">Unable to load release info</Typography>
        <Button
          variant="outlined"
          href="https://github.com/pollen-robotics/reachy-mini-desktop-app/releases"
          target="_blank"
          sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
        >
          View releases on GitHub
        </Button>
      </Box>
    );
  }

  const currentPlatform = detectedPlatform ? PLATFORMS[detectedPlatform] : undefined;
  const currentUrl = detectedPlatform ? releaseData.platforms[detectedPlatform]?.url : undefined;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #000 0%, #0a0a12 50%, #0f0f1a 100%)",
        color: "white",
        pt: 14,
        pb: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 100,
          left: "-10%",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          right: "-15%",
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 100,
          left: "20%",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(255, 149, 0, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero: the mobile app is the main way in. Title, one line, badges. */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            mt: { xs: 2, md: 5 },
            mb: 8,
            p: { xs: 3.5, sm: 6 },
            borderRadius: 6,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Soft glow behind the phone */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: { xs: "50%", md: "14%" },
              transform: "translate(50%, -50%)",
              width: 380,
              height: 380,
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
              filter: "blur(34px)",
              pointerEvents: "none",
            }}
          />

          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ position: "relative", alignItems: "center" }}>
            {/* Title + badges */}
            <Grid size={{ xs: 12, md: 7 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Chip
                label="Start here"
                size="small"
                sx={{
                  mb: 2.5,
                  backgroundColor: "rgba(139, 92, 246, 0.18)",
                  color: "#d6ccff",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  // Room for descenders (the "y") under gradient-clipped text.
                  lineHeight: 1.15,
                  pb: "0.1em",
                }}
              >
                Control your Reachy Mini
              </Typography>

              <Typography
                variant="h6"
                sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 400, maxWidth: 430, mx: { xs: "auto", md: 0 }, mb: 3.5 }}
              >
                Set it up, talk to it, and drive it from your phone - on your desk or across
                the world.
              </Typography>

              <Box sx={{ "& > div": { justifyContent: { xs: "center", md: "flex-start" }, mt: 0 } }}>
                <StoreBadges appStore={APP_STORE_URL} googlePlay={GOOGLE_PLAY_URL} />
              </Box>
            </Grid>

            {/* Phone mockup */}
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex", justifyContent: "center" }}>
              <PhoneMockup />
            </Grid>
          </Grid>
        </Box>

        {/* Which do I need? */}
        <Grid container spacing={2} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                height: "100%",
                p: 3,
                borderRadius: 3,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
                🤖 Reachy Mini (wireless)
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                Just the <strong>mobile app</strong>. The computer is inside the robot, so
                everything - setup, conversation, the store - happens from your phone. The
                desktop app is optional.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                height: "100%",
                p: 3,
                borderRadius: 3,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
                🔧 Reachy Mini lite
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                The <strong>mobile app</strong> plus the <strong>desktop app</strong> below -
                the lite has no computer inside, so your machine runs the robot&apos;s software
                over USB.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Desktop app - Reachy Mini Control */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: "rgba(255,255,255,0.4)", display: "block", letterSpacing: 2, mb: 1 }}
          >
            Desktop app
          </Typography>

          <Typography variant="h4" sx={{ color: "white", fontWeight: 700, mb: 2 }}>
            Reachy Mini Control
          </Typography>

          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 400, mb: 3, maxWidth: 520, mx: "auto" }}>
            Runs the robot&apos;s software on your computer. Required for the Lite version, and
            handy for advanced control of any robot.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 5, justifyContent: "center", alignItems: "center" }}>
            <Chip
              icon={<Box sx={{ width: 8, height: 8, bgcolor: "#10b981", borderRadius: "50%", ml: 1 }} />}
              label={`v${releaseData.version}`}
              sx={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                fontWeight: 600,
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            />
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
              Released {formatDate(releaseData.pub_date)}
            </Typography>
          </Stack>

          {isMobile ? (
            <Box
              sx={{
                mt: 2,
                p: 3,
                background: "linear-gradient(135deg, rgba(255, 149, 0, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)",
                border: "1px solid rgba(255, 149, 0, 0.3)",
                borderRadius: 3,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              <DesktopWindowsIcon sx={{ fontSize: 40, color: "rgba(255,255,255,0.5)", mb: 1.5 }} />
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600, mb: 1 }}>
                Download from a computer
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                Reachy Mini Control is a desktop app for macOS, Windows, and Linux. Open this
                page on a computer to download it - on your phone, grab the mobile app above.
              </Typography>
            </Box>
          ) : (
            <>
              <Button
                variant="contained"
                size="large"
                href={currentUrl}
                startIcon={<DownloadIcon />}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: 17,
                  fontWeight: 600,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #FF9500 0%, #764ba2 100%)",
                  boxShadow: "0 8px 32px rgba(255, 149, 0, 0.35)",
                  transition: "all 0.3s ease",
                  "&:hover": { boxShadow: "0 12px 48px rgba(59, 130, 246, 0.5)", transform: "translateY(-2px)" },
                }}
              >
                Download for {currentPlatform?.name}
              </Button>

              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mt: 2, fontSize: 13 }}>
                {currentPlatform?.subtitle} • {currentPlatform?.format?.replace(".", "").toUpperCase()} package
              </Typography>

              {(detectedPlatform?.startsWith("windows") || detectedPlatform?.includes("linux")) && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2.5,
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: 2,
                    maxWidth: 500,
                    mx: "auto",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                    {detectedPlatform?.startsWith("windows") ? (
                      <>
                        ⚠️ Windows version is currently in Beta - installation requires{" "}
                        <strong style={{ color: "rgba(255,255,255,0.9)" }}>administrator privileges</strong>.
                      </>
                    ) : (
                      <>
                        ⚠️ Linux version is currently in Beta - please report any issues on{" "}
                        <a
                          href="https://github.com/pollen-robotics/reachy-mini-desktop-app/issues"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#3b82f6", textDecoration: "underline" }}
                        >
                          GitHub
                        </a>{" "}
                        or{" "}
                        <a
                          href="https://discord.gg/HDrGY9eJHt"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#3b82f6", textDecoration: "underline" }}
                        >
                          Discord
                        </a>
                        .
                      </>
                    )}
                  </Typography>
                </Box>
              )}
            </>
          )}

          <ImageWithSpinner
            src="/assets/desktop-app-screenshot--white.png"
            alt="Reachy Mini Control Dashboard"
            spinnerColor="primary.main"
            containerSx={{ mt: 6, width: "100%", maxWidth: 700, mx: "auto", minHeight: 200 }}
            sx={{ width: "100%", display: "block", borderRadius: "12px" }}
          />
        </Box>

        {!isMobile && (
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="overline"
              sx={{ color: "rgba(255,255,255,0.4)", display: "block", textAlign: "center", mb: 3, letterSpacing: 2 }}
            >
              Available for all platforms
            </Typography>

            <Grid container spacing={2}>
              {["darwin-aarch64", "windows-x86_64", "linux-x86_64"].map((key) => (
                <Grid size={{ xs: 12, sm: 4 }} key={key}>
                  <PlatformCard
                    platformKey={key}
                    url={releaseData.platforms[key]?.url}
                    isActive={key === detectedPlatform}
                    onClick={() => setDetectedPlatform(key)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 4,
            p: 4,
            mb: 6,
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, color: "white", fontWeight: 600 }}>
            What&apos;s included
          </Typography>

          <Grid container spacing={2}>
            {[
              "3D visualization of your robot",
              "Real-time motor control",
              "App Store with 30+ apps",
              "Camera & microphone access",
              "Record & playback movements",
              "Full SDK integration",
            ].map((feature, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <CheckCircleIcon sx={{ color: "#10b981", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {feature}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mb: 2 }}>
            Requires macOS 11+, Windows 10+, or Debian/Ubuntu Linux
          </Typography>

          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", fontSize: 11, display: "block", mb: 2 }}>
            📊 Anonymous usage data is collected to improve the app.{" "}
            <Box
              component="a"
              href="https://github.com/pollen-robotics/reachy-mini-desktop-app/blob/main/docs/TELEMETRY.md"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "rgba(255, 149, 0, 0.6)",
                textDecoration: "underline",
                cursor: "pointer",
                "&:hover": { color: "rgba(255, 149, 0, 0.8)" },
              }}
            >
              Learn more
            </Box>
          </Typography>

          <Button
            variant="text"
            size="small"
            href="https://github.com/pollen-robotics/reachy-mini-desktop-app/releases"
            target="_blank"
            endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
            sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "white" } }}
          >
            View all releases on GitHub
          </Button>
        </Box>

      </Container>
    </Box>
  );
}
