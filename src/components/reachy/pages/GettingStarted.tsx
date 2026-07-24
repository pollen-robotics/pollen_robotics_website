"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Link,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ImageWithSpinner from "@/components/ImageWithSpinner";
import StoreBadges from "@/components/article/StoreBadges";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/storeLinks";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import WifiIcon from "@mui/icons-material/Wifi";
import UsbIcon from "@mui/icons-material/Usb";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PageHero from "@/components/reachy/PageHero";

const BASE = "/reachy-mini";

function YouTubeEmbed({
  videoId,
  title,
  version = "wireless",
}: {
  videoId: string;
  title: string;
  version?: "lite" | "wireless";
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrlLite = "/assets/miniature_lite.png";
  const thumbnailUrlWireless = "/assets/miniature_wireless.png";

  if (isPlaying) {
    return (
      <Box
        component="iframe"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
      />
    );
  }

  return (
    <Box
      onClick={() => setIsPlaying(true)}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        cursor: "pointer",
        overflow: "hidden",
        "&:hover .play-button": {
          transform: "translate(-50%, -50%) scale(1.1)",
          boxShadow: "0 8px 40px rgba(255, 149, 0, 0.5)",
        },
        "&:hover .overlay": { background: "rgba(0, 0, 0, 0.3)" },
      }}
    >
      <Box
        component="img"
        src={version === "lite" ? thumbnailUrlLite : thumbnailUrlWireless}
        alt={title}
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <Box
        className="overlay"
        sx={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.4)", transition: "background 0.3s ease" }}
      />

      <Box
        className="play-button"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FF9500 0%, #ff7b00 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(255, 149, 0, 0.4)",
          transition: "all 0.3s ease",
        }}
      >
        <PlayArrowIcon sx={{ fontSize: 40, color: "white", ml: 0.5 }} />
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography sx={{ color: "white", fontSize: 13, fontWeight: 600 }}>
          ▶ Watch Assembly Guide
        </Typography>
      </Box>
    </Box>
  );
}

function isMobileDevice(): boolean {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

export default function GettingStarted() {
  const [version, setVersion] = useState<"lite" | "wireless">("wireless");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    const params = new URLSearchParams(window.location.search);
    if (params.get("version") === "lite") setVersion("lite");
  }, []);

  return (
    <>
      <PageHero
        eyebrow="2-3 hours to get started"
        title="Let's bring your Reachy Mini to life"
        subtitle="Let's get your robot assembled, connected, and ready to play. No coding required — just follow these 2 simple steps."
        accentColor="#FF9500"
      >
        <Chip
          icon={<CheckCircleIcon sx={{ color: "white !important" }} />}
          label="Assemble"
          sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600 }}
        />
        <Chip
          icon={<CheckCircleIcon sx={{ color: "white !important" }} />}
          label="Connect & Play!"
          sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600 }}
        />
      </PageHero>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <Typography variant="h3" color="text.primary" sx={{ fontWeight: 700, mb: 3 }}>
            Which version do you have?
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              borderRadius: "50px",
              border: "2px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <ToggleButtonGroup
              value={version}
              exclusive
              onChange={(_, v) => v && setVersion(v)}
              sx={{
                "& .MuiToggleButton-root": {
                  px: 4,
                  py: 1.5,
                  border: "none",
                  borderRadius: 0,
                  fontWeight: 600,
                  fontSize: 15,
                  textTransform: "none",
                  gap: 1,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                  "&:not(:last-of-type)": { borderRight: "1px solid", borderColor: "divider" },
                },
              }}
            >
              <ToggleButton value="wireless">
                <WifiIcon sx={{ fontSize: 20 }} /> Wireless
              </ToggleButton>
              <ToggleButton value="lite">
                <UsbIcon sx={{ fontSize: 20 }} /> Lite (USB)
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {version === "lite" && (
          <>
            <Box sx={{ mb: 10, textAlign: "center" }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 2, fontSize: 12, fontWeight: 600 }}>
                  Step 1
                </Typography>
                <Typography variant="h3" sx={{ mt: 0.5 }}>
                  Assemble your robot
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
                Follow our visual guide to put together your Reachy Mini Lite. Most people finish in{" "}
                <strong>2-3 hours</strong> — our record is 43 minutes! 🏆
              </Typography>

              <Box
                id="assembly-video"
                sx={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  mb: 3,
                  borderRadius: 3,
                  overflow: "hidden",
                  backgroundColor: "#000",
                  maxWidth: 1000,
                  mx: "auto",
                  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
                }}
              >
                <YouTubeEmbed videoId="PC5Yx950nMY" title="Reachy Mini Lite Assembly" version="lite" />
              </Box>

              <Button
                variant="contained"
                size="large"
                href="https://huggingface.co/spaces/pollen-robotics/Reachy_Mini_LITE_Assembly_Guide"
                target="_blank"
                endIcon={<OpenInNewIcon />}
              >
                Open the Interactive Assembly Guide ✨
              </Button>
            </Box>

            <Box sx={{ mb: 10 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 2, fontSize: 12, fontWeight: 600 }}>
                  Step 2
                </Typography>
                <Typography variant="h3" sx={{ mt: 0.5 }}>
                  Connect & install the app
                </Typography>
              </Box>

              <Grid container spacing={4} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stepper orientation="vertical">
                    <Step active completed={false}>
                      <StepLabel>
                        <Typography sx={{ fontWeight: 600 }}>Connect via USB</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          Use the USB cable that came with your robot to connect it to your computer.
                        </Typography>
                      </StepContent>
                    </Step>
                    <Step active completed={false}>
                      <StepLabel>
                        <Typography sx={{ fontWeight: 600 }}>Download the desktop app</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          The desktop app includes everything you need to control your Lite version.
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", mb: 2, color: "warning.main" }}>
                          Desktop App available for macOS (Apple Silicon), Windows & Linux (beta).
                        </Typography>
                        {isMobile ? (
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: "action.hover",
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "divider",
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <DesktopWindowsIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              The desktop app can only be downloaded from a computer.
                            </Typography>
                          </Box>
                        ) : (
                          <Button variant="contained" component={NextLink} href={`${BASE}/download`} startIcon={<DownloadIcon />}>
                            Download Desktop App
                          </Button>
                        )}
                      </StepContent>
                    </Step>
                    <Step active completed={false}>
                      <StepLabel>
                        <Typography sx={{ fontWeight: 600 }}>Open the app & play!</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          The app will automatically detect your robot. Click &quot;Wake Up&quot; to start, then
                          explore 30+ apps created by the community, from hand tracking to AI conversations! If you
                          experience any issues, feel free to check our{" "}
                          <a href="https://huggingface.co/docs/reachy_mini/troubleshooting" target="_blank" rel="noreferrer">
                            Troubleshooting & FAQ page
                          </a>{" "}
                          or contact us on{" "}
                          <a href="https://discord.gg/HDrGY9eJHt" target="_blank" rel="noreferrer">
                            Discord
                          </a>
                          .
                        </Typography>
                      </StepContent>
                    </Step>
                  </Stepper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <ImageWithSpinner
                    src="/assets/desktop-app-screenshot--dark.png"
                    alt="Reachy Mini Control App"
                    spinnerColor="primary.main"
                    containerSx={{ width: "100%", minHeight: 200 }}
                    sx={{ width: "100%", display: "block", borderRadius: "12px" }}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        {version === "wireless" && (
          <>
            <Box sx={{ mb: 10, textAlign: "center" }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 2, fontSize: 12, fontWeight: 600 }}>
                  Step 1
                </Typography>
                <Typography variant="h3" sx={{ mt: 0.5 }}>
                  Assemble your robot
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
                Follow our visual guide to put together your Reachy Mini. Most people finish in{" "}
                <strong>2-3 hours</strong> - our record is 43 minutes! 🏆
              </Typography>

              <Box
                id="assembly-video"
                sx={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  mb: 3,
                  borderRadius: 3,
                  overflow: "hidden",
                  backgroundColor: "#000",
                  maxWidth: 1000,
                  mx: "auto",
                  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
                }}
              >
                <YouTubeEmbed videoId="WeKKdnuXca4" title="Reachy Mini Assembly" version="wireless" />
              </Box>

              <Button
                variant="contained"
                size="large"
                href="https://huggingface.co/spaces/pollen-robotics/Reachy_Mini_Assembly_Guide"
                target="_blank"
                endIcon={<OpenInNewIcon />}
              >
                Open the Interactive Assembly Guide ✨
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                Beta version? Your guide is{" "}
                <Link href="https://huggingface.co/spaces/pollen-robotics/Reachy_Mini_BETA_Assembly_Guide" target="_blank">
                  here
                </Link>
                .
              </Typography>
            </Box>

            <Box sx={{ mb: 10 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 2, fontSize: 12, fontWeight: 600 }}>
                  Step 2
                </Typography>
                <Typography variant="h3" sx={{ mt: 0.5 }}>
                  Connect & install the app
                </Typography>
              </Box>

              <Grid container spacing={4} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stepper orientation="vertical">
                    <Step active completed={false}>
                      <StepLabel>
                        <Typography sx={{ fontWeight: 600 }}>Power on your Reachy Mini</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          Wait about 30 seconds for the robot to boot up.
                        </Typography>
                      </StepContent>
                    </Step>
                    <Step active completed={false}>
                      <StepLabel>
                        <Typography sx={{ fontWeight: 600 }}>Download the mobile app</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          The mobile app is all you need for the Wireless version. Grab it on your
                          phone - it sets up your robot and is how you use it day to day.
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", mb: 1, color: "text.secondary" }}>
                          Available for iOS and Android.
                        </Typography>
                        <Box sx={{ "& > div": { justifyContent: "flex-start", my: 1 } }}>
                          <StoreBadges appStore={APP_STORE_URL} googlePlay={GOOGLE_PLAY_URL} height={44} />
                        </Box>
                      </StepContent>
                    </Step>
                    <Step active completed={false}>
                      <StepLabel>
                        <Typography sx={{ fontWeight: 600 }}>Connect the robot to your Wi-Fi</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Open the mobile app: it finds your robot over Bluetooth, connects it to
                          your Wi-Fi network, and you sign in with your Hugging Face account.
                        </Typography>
                      </StepContent>
                    </Step>
                    <Step active completed={false}>
                      <StepLabel>
                        <Typography sx={{ fontWeight: 600 }}>Open the app & play!</Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          Your robot shows up in the app - tap to connect and follow the guided
                          wake-up. From there, talk to it and explore apps from the store, from
                          telepresence to AI conversations! If you experience any issues, feel free
                          to check our{" "}
                          <a href="https://huggingface.co/docs/reachy_mini/troubleshooting" target="_blank" rel="noreferrer">
                            Troubleshooting & FAQ page
                          </a>{" "}
                          or contact us on{" "}
                          <a href="https://discord.gg/HDrGY9eJHt" target="_blank" rel="noreferrer">
                            Discord
                          </a>
                          .
                        </Typography>
                      </StepContent>
                    </Step>
                  </Stepper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <ImageWithSpinner
                    src="/assets/mobile-app-screenshot.png"
                    alt="Reachy Mini mobile app"
                    spinnerColor="primary.main"
                    containerSx={{ width: "100%", minHeight: 200, display: "flex", justifyContent: "center" }}
                    sx={{ width: "auto", maxHeight: 560, display: "block", borderRadius: "12px" }}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        <Box
          sx={{
            p: 6,
            borderRadius: 4,
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            src="/assets/reachy-how-to-create-app.svg"
            alt="Build"
            sx={{ width: 220, height: 220, mb: 3 }}
          />
          <Typography variant="h4" sx={{ mb: 2 }}>
            Want to create your own apps?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, maxWidth: 500, mx: "auto" }}>
            Learn how to code with the Python SDK, create custom experiences, and share them with the community.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component="a"
            href="https://huggingface.co/docs/reachy_mini/index#-apps--ecosystem"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ px: 4 }}
          >
            Go to Create Guide →
          </Button>
        </Box>
      </Container>
    </>
  );
}
