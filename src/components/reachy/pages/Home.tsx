"use client";

import { useState, useEffect, type CSSProperties } from "react";
import NextLink from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PublicIcon from "@mui/icons-material/Public";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Section from "@/components/reachy/Section";
import ImageWithSpinner from "@/components/ImageWithSpinner";
import VideoWithSpinner from "@/components/VideoWithSpinner";
import { useApps } from "@/context/AppsContext";

const BASE = "/reachy-mini";

interface FloatingStickerProps {
  src: string;
  size: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  rotation?: number;
  floatRange?: number;
  floatSpeed?: number;
  scrollFactor?: number;
}

function FloatingSticker({
  src,
  size,
  top,
  left,
  right,
  bottom,
  rotation = 0,
  floatRange = 15,
  floatSpeed = 6000,
  scrollFactor = 0.05,
}: FloatingStickerProps) {
  const [floatOffset, setFloatOffset] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      setFloatOffset(Math.sin((elapsed / floatSpeed) * Math.PI * 2) * floatRange);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [floatSpeed, floatRange]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const style: CSSProperties = {
    position: "absolute",
    top,
    left,
    right,
    bottom,
    width: size,
    height: "auto",
    pointerEvents: "none",
    zIndex: 2,
    transform: `translateY(${floatOffset + scrollY * scrollFactor}px) rotate(${rotation}deg)`,
  };

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" style={style} />;
}

function HeroDesktop() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#000",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -1,
          left: 0,
          right: 0,
          height: 90,
          background: "inherit",
          backgroundColor: "background.default",
          borderRadius: "100% 100% 0 0 / 100% 100% 0 0",
          transform: "translateY(50%)",
        },
      }}
    >
      <VideoWithSpinner
        src="/assets/Reachy-mini-wake-up-companion.mp4"
        autoPlay
        muted
        loop
        playsInline
        spinnerColor="rgba(255,255,255,0.6)"
        containerSx={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          opacity: 0.9,
          transform: `translate(-45%, calc(-50% + ${scrollY * 0.15}px))`,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.15) 100%),
            linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%),
            radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)
          `,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        <Box sx={{ maxWidth: 640 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500 }}>
              Open Source Robot
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.3)" }} />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              Powered by{" "}
              <Box component="img" src="/assets/hf-logo.svg" alt="Hugging Face" sx={{ height: 14 }} />
            </Typography>
          </Stack>

          <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                color: "white",
                background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                // Gradient text clips its fill to the line box; the theme's tight
                // h1 line-height (1.05) would cut descenders (the "y"). Give the
                // painted area room so lower letters aren't sliced.
                lineHeight: 1.2,
                pb: "0.1em",
              }}
            >
              Reachy Mini
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="p"
            sx={{
              color: "rgba(255,255,255,0.75)",
              fontWeight: 400,
              mb: 4,
              lineHeight: 1.6,
              maxWidth: 520,
            }}
          >
            An expressive companion robot designed for{" "}
            <Box component="span" sx={{ color: "white", fontWeight: 500 }}>
              human interaction
            </Box>
            ,{" "}
            <Box component="span" sx={{ color: "white", fontWeight: 500 }}>
              creative coding
            </Box>
            , and{" "}
            <Box component="span" sx={{ color: "white", fontWeight: 500 }}>
              AI experimentation
            </Box>
            .
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              component={NextLink}
              href={`${BASE}/buy`}
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.75,
                fontSize: 16,
                fontWeight: 600,
                background: "linear-gradient(135deg, #FF9500 0%, #ff7b00 100%)",
                boxShadow: "0 4px 24px rgba(255, 149, 0, 0.35)",
                "&:hover": {
                  boxShadow: "0 8px 32px rgba(255, 149, 0, 0.5)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Buy Reachy Mini
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={NextLink}
              href={`${BASE}/getting-started`}
              sx={{
                px: 4,
                py: 1.75,
                fontSize: 16,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": {
                  color: "white",
                  borderColor: "rgba(255,255,255,0.6)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

function HeroMobile() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -1,
          left: 0,
          right: 0,
          height: 40,
          backgroundColor: "background.default",
          borderRadius: "100% 100% 0 0 / 100% 100% 0 0",
          transform: "translateY(50%)",
          zIndex: 5,
        },
      }}
    >
      <VideoWithSpinner
        src="/assets/Reachy-mini-wake-up-companion.mp4"
        autoPlay
        muted
        loop
        playsInline
        spinnerColor="rgba(255,255,255,0.6)"
        containerSx={{ position: "absolute", inset: 0, zIndex: 0 }}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 30%",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.92) 92%, #000 100%)
          `,
        }}
      />

      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          px: 3,
          pt: 12,
          pb: 7,
          zIndex: 3,
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              display: "inline-flex",
              px: 1.5,
              py: 0.75,
              mb: 2,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#4ade80",
                boxShadow: "0 0 8px rgba(74, 222, 128, 0.6)",
              }}
            />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Open Source
            </Typography>
            <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.3)" }} />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              by
              <Box component="img" src="/assets/hf-logo.svg" alt="Hugging Face" sx={{ height: 14 }} />
            </Typography>
          </Stack>

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: 60, sm: 76 },
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: "white",
              mb: 2,
            }}
          >
            Reachy Mini
          </Typography>

          <Typography
            component="p"
            sx={{
              fontSize: 15,
              color: "rgba(255,255,255,0.65)",
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: 300,
            }}
          >
            An expressive companion robot for{" "}
            <Box component="span" sx={{ color: "white", fontWeight: 500 }}>
              human interaction
            </Box>
            ,{" "}
            <Box component="span" sx={{ color: "white", fontWeight: 500 }}>
              creative coding
            </Box>{" "}
            and{" "}
            <Box component="span" sx={{ color: "white", fontWeight: 500 }}>
              AI experimentation
            </Box>
            .
          </Typography>
        </Box>

        <Stack spacing={1.5} sx={{ mt: 3 }}>
          <Button
            component={NextLink}
            href={`${BASE}/buy`}
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.75,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 50,
              background: "linear-gradient(135deg, #FF9500 0%, #ff7b00 100%)",
              boxShadow: "0 6px 24px rgba(255, 149, 0, 0.35)",
            }}
          >
            Buy Reachy Mini
          </Button>

          <Button
            component={NextLink}
            href={`${BASE}/getting-started`}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              alignSelf: "center",
              color: "rgba(255,255,255,0.7)",
              fontSize: 14,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": { color: "white", backgroundColor: "transparent" },
            }}
          >
            Get started
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function Hero() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return isMobile ? <HeroMobile /> : <HeroDesktop />;
}

function StatsSection() {
  return (
    <Section id="stats" sx={{ py: { xs: 8, md: 12 }, position: "relative", overflow: "visible" }}>
      <Grid container spacing={2} sx={{ overflow: "visible" }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ overflow: "visible" }}>
          <Box
            component={NextLink}
            href={`${BASE}/getting-started`}
            sx={{
              height: { xs: 280, md: 320 },
              borderRadius: 4,
              background: "#0f0f1a",
              border: "1px solid rgba(255,255,255,0.08)",
              p: { xs: 4, md: 6 },
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              clipPath: "inset(-100px -50px 0 0 round 16px)",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "border-color 0.3s ease, transform 0.3s ease",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.2)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <FloatingSticker
                src="/assets/reachy-how-to-create-app.svg"
                size={336}
                top={-60}
                right={10}
                rotation={0}
                floatRange={8}
                floatSpeed={5000}
                scrollFactor={0.03}
              />
            </Box>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography sx={{ fontSize: { xs: 50, md: 60 }, fontWeight: 800, lineHeight: 1, color: "white" }}>
                Build your
                <br />
                own robot
              </Typography>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mt: 1 }}>
                Get Started
              </Typography>
            </Box>
            <Typography
              sx={{ color: "rgba(255,255,255,0.5)", fontSize: 15, position: "relative", zIndex: 1, maxWidth: 400 }}
            >
              Follow our guides to assemble your Reachy Mini →
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            component={NextLink}
            href={`${BASE}/apps`}
            sx={{
              height: { xs: 280, md: 320 },
              borderRadius: 4,
              background: "#0f0f1a",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              position: "relative",
              textDecoration: "none",
              display: "block",
              transition: "all 0.3s ease",
              "&:hover": { borderColor: "rgba(255,255,255,0.2)" },
            }}
          >
            <ImageWithSpinner
              src="/assets/reachy-mini-hand-tracking.gif"
              alt="Real-time interaction"
              containerSx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                p: { xs: 4, md: 5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <Typography sx={{ fontSize: { xs: 56, md: 72 }, fontWeight: 800, lineHeight: 1, color: "white" }}>
                Apps
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 14, mt: 0.5 }}>
                  Explore ready-to-use app →
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box
            component="a"
            href="https://discord.gg/2bAhWfXme9"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              height: { xs: 200, md: 200 },
              borderRadius: 4,
              background: "#0f0f1a",
              border: "1px solid rgba(255,255,255,0.08)",
              p: { xs: 4, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textDecoration: "none",
              transition: "all 0.3s ease",
              "&:hover": { borderColor: "rgba(255,255,255,0.2)" },
            }}
          >
            <Box
              component="img"
              src="/assets/discord-logo.svg"
              alt="Discord"
              sx={{ width: 36, height: 36, opacity: 0.8 }}
            />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                Join our Discord Community
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 14, mt: 0.5 }}>
                We are already +9.000 Makers →
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            component="a"
            href="https://huggingface.co/docs/reachy_mini/SDK/readme"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              height: { xs: 200, md: 200 },
              borderRadius: 4,
              background: "#0d1117",
              border: "1px solid rgba(255,255,255,0.08)",
              p: { xs: 4, md: 5 },
              display: "flex",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              transition: "all 0.3s ease",
              overflow: "hidden",
              "&:hover": { borderColor: "rgba(255,255,255,0.2)" },
            }}
          >
            <Box
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: { xs: 12, md: 14 },
                color: "#e6edf3",
                flex: 1,
                whiteSpace: "pre",
                overflow: "hidden",
              }}
            >
              <Box component="span" sx={{ color: "#ff7b72" }}>
                from
              </Box>{" "}
              <Box component="span" sx={{ color: "#79c0ff" }}>
                reachy_mini
              </Box>{" "}
              <Box component="span" sx={{ color: "#ff7b72" }}>
                import
              </Box>{" "}
              <Box component="span" sx={{ color: "#ffa657" }}>
                ReachyMini
              </Box>
              {"\n\n"}
              <Box component="span" sx={{ color: "#ff7b72" }}>
                with
              </Box>{" "}
              <Box component="span" sx={{ color: "#ffa657" }}>
                ReachyMini
              </Box>
              <Box component="span" sx={{ color: "#8b949e" }}>
                ()
              </Box>{" "}
              <Box component="span" sx={{ color: "#ff7b72" }}>
                as
              </Box>{" "}
              <Box component="span" sx={{ color: "#79c0ff" }}>
                mini
              </Box>
              :{"\n"}
              {"    "}mini.
              <Box component="span" sx={{ color: "#d2a8ff" }}>
                goto_target
              </Box>
              (head=pose)
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
                Discover the Python SDK
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 14, mt: 0.5 }}>
                Full control in 3 lines →
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Section>
  );
}

function ProductsSection() {
  return (
    <Section background="alt" sx={{ py: { xs: 8, md: 12 }, position: "relative", overflow: "visible" }}>
      <Box sx={{ display: { xs: "none", lg: "block" } }}>
        <FloatingSticker
          src="/assets/reachies/captain.png"
          size={240}
          top={80}
          left={60}
          rotation={-8}
          floatRange={12}
          floatSpeed={5500}
          scrollFactor={0.03}
        />
      </Box>

      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Two ways to Reachy
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: "auto" }}>
          Choose wireless for standalone use, or Lite for a budget-friendly tethered experience.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ justifyContent: "center" }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              p: 5,
              borderRadius: 4,
              border: "2px solid",
              borderColor: "primary.main",
              background: "linear-gradient(135deg, rgba(255,149,0,0.03) 0%, transparent 100%)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                px: 2,
                py: 0.5,
                borderRadius: 50,
                background: "linear-gradient(135deg, #FF9500 0%, #ff7b00 100%)",
              }}
            >
              <Typography sx={{ color: "white", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                Most Popular
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              Reachy Mini
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Wireless • On-board compute
            </Typography>

            <Typography
              sx={{
                fontSize: 56,
                fontWeight: 800,
                mb: 3,
                background: "linear-gradient(135deg, #FF9500 0%, #ff7b00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              $499
            </Typography>

            <Stack spacing={1} sx={{ mb: 4, textAlign: "left", maxWidth: 280, mx: "auto" }}>
              {[
                "Raspberry Pi CM 4 on-board",
                "Wi-Fi + USB",
                "Camera, 4 mics, speaker",
                "Accelerometer",
              ].map((item) => (
                <Typography key={item} sx={{ fontSize: 14, color: "text.secondary" }}>
                  ✓ {item}
                </Typography>
              ))}
            </Stack>

            <Button
              variant="contained"
              size="large"
              fullWidth
              href="https://store.pollen-robotics.com/products/reachy-mini-wireless-version"
              target="_blank"
              sx={{ py: 1.5 }}
            >
              Order Now
            </Button>

            <Typography
              sx={{ mt: 2, fontSize: 13, fontWeight: 600, color: "text.secondary" }}
            >
              Outside EU/UK &amp; US/Canada?
            </Typography>
            <Button
              variant="outlined"
              size="medium"
              fullWidth
              href="https://www.seeedstudio.com/Reachy-Mini-Wireless-Kit-p-6724.html"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<PublicIcon />}
              sx={{ mt: 1 }}
            >
              Order via Seeed Studio
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ p: 5, borderRadius: 4, border: "1px solid", borderColor: "divider", textAlign: "center" }}>
            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              Reachy Mini Lite
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              USB • External compute
            </Typography>

            <Typography sx={{ fontSize: 56, fontWeight: 800, mb: 3, color: "text.primary" }}>$399</Typography>

            <Stack spacing={1} sx={{ mb: 4, textAlign: "left", maxWidth: 280, mx: "auto" }}>
              {[
                "Your Mac/PC as brain",
                "USB only",
                "Camera, 4 mics, speaker",
                "Same motion capabilities",
              ].map((item) => (
                <Typography key={item} sx={{ fontSize: 14, color: "text.secondary" }}>
                  ✓ {item}
                </Typography>
              ))}
            </Stack>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              href="https://store.pollen-robotics.com/products/reachy-mini-lite-version"
              target="_blank"
              sx={{ py: 1.5 }}
            >
              Order Now
            </Button>

            <Typography
              sx={{ mt: 2, fontSize: 13, fontWeight: 600, color: "text.secondary" }}
            >
              Outside EU/UK &amp; US/Canada?
            </Typography>
            <Button
              variant="outlined"
              size="medium"
              fullWidth
              href="https://www.seeedstudio.com/Reachy-Mini-Lite-Kit-p-6702.html"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<PublicIcon />}
              sx={{ mt: 1 }}
            >
              Order via Seeed Studio
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
          Lead time: up to 90 days after purchase (many orders ship sooner)
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, maxWidth: 520, mx: "auto", lineHeight: 1.7 }}>
          <strong>Shipping and import duties:</strong> all orders ship DAP (Delivered At Place).
          <br />
          Shipping costs and any local import duties, taxes, or customs fees are the responsibility of the buyer and are not included in the product price.
          <br />
          Our store ships to EU/UK and US/Canada. For other countries, order
          from our official distributor{" "}
          <Link
            href="https://www.seeedstudio.com/Reachy-Mini-Wireless-Kit-p-6724.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Seeed Studio
          </Link>
          .
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 3 }}>
        Both ship as DIY kits. Assembly takes ~2 hours.{" "}
        <Link component={NextLink} href={`${BASE}/getting-started`}>
          Watch the guide →
        </Link>
      </Typography>
    </Section>
  );
}

function AppsShowcase() {
  const { apps } = useApps();
  const appsCountRounded = Math.floor(apps.length / 10) * 10;

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: "#0a0a12", position: "relative", overflow: "visible" }}>
      <Box sx={{ display: { xs: "none", lg: "block" } }}>
        <FloatingSticker
          src="/assets/reachies/jazzman.png"
          size={240}
          top={40}
          right={80}
          rotation={10}
          floatRange={10}
          floatSpeed={5800}
          scrollFactor={0.04}
        />
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: "rgba(255,255,255,0.5)", mb: 2, display: "block", letterSpacing: "0.15em" }}
          >
            App Ecosystem
          </Typography>
          <Typography variant="h2" sx={{ color: "white", mb: 3 }}>
            {appsCountRounded}+ apps, one click install
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", maxWidth: 500, mx: "auto", lineHeight: 1.7 }}>
            From AI conversations to hand tracking - explore what the community has built or create
            your own and share it with the world.
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 4,
            borderRadius: 4,
            overflow: "hidden",
            background: "#0f0f1a",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              flex: { xs: "none", md: 1 },
              height: { xs: 250, md: "auto" },
              minHeight: { md: 320 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <ImageWithSpinner
              src="/assets/reachy-conversation-app.jpg"
              alt="AI Companion"
              containerSx={{ width: "100%", height: "100%" }}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <Box
            sx={{
              flex: { xs: "none", md: 1 },
              p: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.5,
                mb: 2,
                borderRadius: 50,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                width: "fit-content",
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.5)" }} />
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Featured
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ color: "white", mb: 2 }}>
              AI Companion
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", mb: 4, lineHeight: 1.8, maxWidth: 400 }}>
              Have a conversation with Reachy! Powered by LLMs, it understands what you say and
              responds with expressive movements and speech.
            </Typography>
            <Button component={NextLink} href={`${BASE}/apps`} variant="contained" endIcon={<ArrowForwardIcon />}>
              Try it now
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background: "#0f0f1a",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                height: { xs: "auto", md: 200 },
                transition: "border-color 0.3s",
                "&:hover": { borderColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: 200 },
                  height: { xs: 150, sm: "auto" },
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                <ImageWithSpinner
                  src="/assets/reachy-hand-tracking-app.jpg"
                  alt="Hand Tracking"
                  containerSx={{ width: "100%", height: "100%" }}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography variant="h5" sx={{ color: "white", mb: 1 }}>
                  Hand Tracking
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6 }}>
                  Reachy follows your hand movements in real-time using OpenCV.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component={NextLink}
              href={`${BASE}/apps`}
              sx={{
                borderRadius: 4,
                height: { xs: 150, md: 200 },
                background: "#0f0f1a",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "all 0.3s",
                "&:hover": { borderColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <Typography sx={{ fontSize: 48, fontWeight: 800, color: "white", mb: 1 }}>
                +{appsCountRounded}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                more apps to explore
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 13, mt: 0.5 }}>
                Browse all →
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            Got an idea?{" "}
            <Link
              href="https://huggingface.co/docs/reachy_mini/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Build your own app →
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

function CommunitySection() {
  return (
    <Section sx={{ py: { xs: 8, md: 12 }, position: "relative", overflow: "visible" }}>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <FloatingSticker
          src="/assets/reachies/cowboy.png"
          size={280}
          top={-20}
          left={100}
          rotation={-10}
          floatRange={12}
          floatSpeed={5500}
          scrollFactor={0.04}
        />
        <FloatingSticker
          src="/assets/reachies/astronaut.png"
          size={300}
          bottom={-40}
          right={120}
          rotation={8}
          floatRange={15}
          floatSpeed={6500}
          scrollFactor={0.05}
        />
      </Box>

      <Box
        sx={{
          background: "#0f0f1a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          p: { xs: 5, md: 8 },
          textAlign: "center",
          color: "white",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Join +9.000 makers
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.6)", maxWidth: 500, mx: "auto", mb: 4, lineHeight: 1.8 }}>
            Connect with other Reachy Mini owners on Discord. Share your projects, get help, and
            stay updated on the latest developments.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="https://discord.gg/2bAhWfXme9"
            target="_blank"
            endIcon={<OpenInNewIcon />}
          >
            Join Discord
          </Button>
        </Box>
      </Box>
    </Section>
  );
}

function FinalCTA() {
  return (
    <Section background="alt" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ textAlign: "center", maxWidth: 600, mx: "auto" }}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Ready to meet Reachy?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, lineHeight: 1.8 }}>
          Get your own expressive companion robot and join the community of makers building the
          future of human-robot interaction.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            component={NextLink}
            href={`${BASE}/buy`}
            sx={{ px: 5, py: 1.75, fontSize: 16 }}
          >
            Buy Reachy Mini
          </Button>
        </Stack>
      </Box>
    </Section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ProductsSection />
      <AppsShowcase />
      <CommunitySection />
      <FinalCTA />
    </>
  );
}
