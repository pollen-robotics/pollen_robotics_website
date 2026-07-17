import type { Metadata } from "next";
import { Box, Button, Typography } from "@mui/material";
import { POLLEN_MARK, HF_LOGO } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Pollen Robotics - Robots, open by design",
  description:
    "We design expressive, open-source robots - and release the hardware, the software, and everything in between.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <Box
      component="main"
      sx={{
        maxWidth: 1180,
        mx: "auto",
        px: "clamp(1rem, 4vw, 2.5rem)",
      }}
    >
      <Box
        component="section"
        sx={{
          minHeight: "calc(100vh - 44px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: { xs: 6, md: 8 },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            mb: "1.3rem",
          }}
        >
          <Box
            component="img"
            src={POLLEN_MARK}
            alt=""
            aria-hidden="true"
            sx={{ width: 22, height: 22, objectFit: "contain" }}
          />
          <Typography
            component="p"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "text.primary",
              m: 0,
            }}
          >
            Pollen Robotics
          </Typography>
          <Box
            component="span"
            aria-hidden="true"
            sx={{ mx: "0.1rem", fontSize: "0.9rem", fontWeight: 400, color: "text.secondary" }}
          >
            ×
          </Box>
          <Box
            component="img"
            src={HF_LOGO}
            alt="Hugging Face"
            sx={{ display: "block", height: 22, width: "auto", objectFit: "contain" }}
          />
          <Typography
            component="p"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "text.primary",
              m: 0,
            }}
          >
            Hugging Face
          </Typography>
        </Box>

        <Typography
          component="h1"
          sx={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            mb: "1.4rem",
          }}
        >
          Robots,{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(135deg, #FF9500 0%, #FFB340 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            open
          </Box>
          <br />
          by design.
        </Typography>

        <Typography
          sx={{
            fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
            color: "text.secondary",
            lineHeight: 1.55,
            maxWidth: "44ch",
            mx: "auto",
            mb: "2rem",
          }}
        >
          We design expressive, open-source robots - and release the hardware,
          the software, and everything in between. Hack them, teach them, make
          them yours.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "0.9rem",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button href="/reachy-mini" variant="contained" color="primary">
            Discover Reachy Mini
          </Button>
        </Box>

        <Typography
          sx={{
            mt: "1.8rem",
            fontSize: "0.82rem",
            color: "text.secondary",
            letterSpacing: "0.01em",
          }}
        >
          Open source · Built with the Hugging Face community · Made in France
        </Typography>
      </Box>
    </Box>
  );
}
