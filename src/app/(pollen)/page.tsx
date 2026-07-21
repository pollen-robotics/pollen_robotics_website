import type { Metadata } from "next";
import { Box, Button, Typography } from "@mui/material";
import ImageWithSpinner from "@/components/ImageWithSpinner";
import VideoWithSpinner from "@/components/VideoWithSpinner";
import { POLLEN_MARK, HF_LOGO } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Pollen Robotics - Robots for AI builders",
  description:
    "Pollen Robotics, now part of Hugging Face, builds expressive, interactive robots for AI builders and makers - dynamic, social and playful. Meet Reachy Mini and Reachy 2.",
  alternates: { canonical: "/" },
};

const ORANGE_GRADIENT = "linear-gradient(135deg, #FF9500 0%, #FFB340 100%)";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="p"
      sx={{
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        fontSize: "0.78rem",
        fontWeight: 700,
        color: "primary.main",
        m: 0,
        mb: "0.9rem",
      }}
    >
      {children}
    </Typography>
  );
}

function ProductCard({
  href,
  eyebrow,
  name,
  body,
  cta,
  badge,
  media,
}: {
  href: string;
  eyebrow: string;
  name: string;
  body: string;
  cta: string;
  badge?: string;
  media: React.ReactNode;
}) {
  return (
    <Box
      component="a"
      href={href}
      sx={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 24px 60px rgba(0,0,0,0.12)" },
      }}
    >
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16 / 11",
          overflow: "hidden",
          "& img, & video": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          },
        }}
      >
        {media}
        {badge && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              px: 1.5,
              py: 0.6,
              borderRadius: 999,
              background: ORANGE_GRADIENT,
              color: "#fff",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              boxShadow: "0 6px 20px rgba(255,149,0,0.35)",
            }}
          >
            {badge}
          </Box>
        )}
      </Box>

      <Box sx={{ p: { xs: 3, md: 3.5 }, display: "flex", flexDirection: "column", flex: 1 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Typography
          component="h2"
          sx={{
            fontSize: "clamp(1.6rem, 2.6vw, 2rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            mb: "0.7rem",
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            fontSize: "1rem",
            color: "text.secondary",
            lineHeight: 1.6,
            mb: "1.4rem",
          }}
        >
          {body}
        </Typography>
        <Typography
          component="span"
          sx={{
            mt: "auto",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          {cta} &rarr;
        </Typography>
      </Box>
    </Box>
  );
}

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
      {/* Hero */}
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          pt: { xs: 6, md: 10 },
          pb: { xs: 5, md: 7 },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            mb: "1.3rem",
            flexWrap: "wrap",
            justifyContent: "center",
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
          Robots that bring{" "}
          <Box
            component="span"
            sx={{
              background: ORANGE_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            AI
          </Box>
          <br />
          to life.
        </Typography>

        <Typography
          sx={{
            fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
            color: "text.secondary",
            lineHeight: 1.55,
            maxWidth: "52ch",
            mx: "auto",
            mb: "2rem",
          }}
        >
          Expressive, interactive robots for AI builders and makers - dynamic,
          social and playful. Program them, play with them, make them yours.
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
          <Button href="/reachy-2" variant="outlined" color="primary">
            Explore Reachy 2
          </Button>
        </Box>
      </Box>

      {/* The two robots */}
      <Box
        component="section"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 3, md: 4 },
          pb: { xs: 6, md: 9 },
        }}
      >
        <ProductCard
          href="/reachy-mini"
          eyebrow="Expressive companion robot"
          name="Reachy Mini"
          badge="10,000+ shipped worldwide"
          body="An expressive companion robot for human interaction, creative coding and AI experimentation."
          cta="Discover Reachy Mini"
          media={
            <VideoWithSpinner
              src="/assets/Reachy-mini-wake-up-companion.mp4"
              autoPlay
              muted
              loop
              playsInline
              spinnerColor="rgba(0,0,0,0.26)"
              containerSx={{ width: "100%", height: "100%" }}
            />
          }
        />
        <ProductCard
          href="/reachy-2"
          eyebrow="Humanoid for embodied AI"
          name="Reachy 2"
          body="A human-scale, bimanual mobile manipulator - the ideal robot for AI & robotics labs building embodied AI."
          cta="Explore Reachy 2"
          media={
            <ImageWithSpinner
              src="/assets/reachy2/full-robot.webp"
              alt="Reachy 2 humanoid robot"
              spinnerColor="rgba(0,0,0,0.26)"
              containerSx={{ position: "absolute", inset: 0 }}
            />
          }
        />
      </Box>

      {/* Hugging Face band */}
      <Box
        component="section"
        sx={{
          display: "flex",
          justifyContent: "center",
          pb: { xs: 6, md: 9 },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            px: "1.1rem",
            py: "0.7rem",
            borderRadius: 999,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            component="img"
            src={HF_LOGO}
            alt="Hugging Face"
            sx={{ display: "block", height: 20, width: "auto", objectFit: "contain" }}
          />
          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Pollen Robotics is now part of Hugging Face
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
