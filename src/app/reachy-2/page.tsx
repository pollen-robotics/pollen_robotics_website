import type { Metadata } from "next";
import { Box, Button, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Reachy 2 - The open-source humanoid for embodied AI",
  description:
    "Reachy 2 is the first open-source humanoid robot designed for embodied AI and real-world applications - the ideal bimanual mobile manipulator for AI & robotics labs.",
  alternates: { canonical: "/reachy-2" },
};

const GET_URL = "https://www.pollen-robotics.com/reachy/";
const DOCS_URL = "https://docs.pollen-robotics.com/";
const SDK_URL = "https://github.com/pollen-robotics/reachy2-sdk";

const ASSET = "/assets/reachy2";

const CONTENT_PX = "clamp(1.25rem, 5vw, 4rem)";

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <Typography
      component="p"
      sx={{
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        fontSize: "0.78rem",
        fontWeight: 700,
        color: light ? "rgba(255,255,255,0.6)" : "primary.main",
        m: 0,
        mb: "1rem",
      }}
    >
      {children}
    </Typography>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  media,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  media: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        alignItems: "center",
        gap: { xs: 3, md: 6 },
        py: { xs: 5, md: 8 },
      }}
    >
      <Box sx={{ order: { xs: 2, md: reverse ? 2 : 1 } }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Typography
          component="h2"
          sx={{
            fontSize: "clamp(1.7rem, 3.2vw, 2.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            mb: "1rem",
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: "1.05rem", color: "text.secondary", lineHeight: 1.65, maxWidth: "44ch" }}>
          {body}
        </Typography>
      </Box>
      <Box sx={{ order: { xs: 1, md: reverse ? 1 : 2 } }}>{media}</Box>
    </Box>
  );
}

function MediaCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
        aspectRatio: "1 / 1",
        "& img, & video": { width: "100%", height: "100%", objectFit: "cover", display: "block" },
      }}
    >
      {children}
    </Box>
  );
}

function SpecItem({ value, label }: { value: string; label: string }) {
  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: "16px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", color: "text.primary" }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", color: "text.secondary", mt: 0.5 }}>{label}</Typography>
    </Box>
  );
}

function KitCard({ img, name, config }: { img: string; name: string; config: string }) {
  return (
    <Box
      component="a"
      href={GET_URL}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 18px 44px rgba(0,0,0,0.12)" },
      }}
    >
      <Box sx={{ aspectRatio: "1 / 1", "& img": { width: "100%", height: "100%", objectFit: "cover", display: "block" } }}>
        <img src={img} alt={name} loading="lazy" />
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "primary.main" }}>
          {config}
        </Typography>
        <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, mt: 0.5 }}>{name}</Typography>
        <Typography sx={{ fontSize: "0.9rem", color: "text.secondary", mt: 1.5, fontWeight: 600 }}>
          Download kit &rarr;
        </Typography>
      </Box>
    </Box>
  );
}

export default function Reachy2Page() {
  return (
    <Box component="main">
      {/* Hero */}
      <Box
        component="section"
        sx={{
          bgcolor: "#0a0a0b",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-30%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle, rgba(255,149,0,0.16) 0%, rgba(255,149,0,0) 60%)",
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 1280,
            mx: "auto",
            px: CONTENT_PX,
            pt: { xs: "6.5rem", md: "8rem" },
            pb: { xs: "3.5rem", md: "5rem" },
            minHeight: { md: "100vh" },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            alignItems: "center",
            gap: { xs: 4, md: 6 },
            position: "relative",
          }}
        >
          <Box>
            <Eyebrow light>Open-source humanoid</Eyebrow>
            <Typography
              component="h1"
              sx={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.98,
                mb: "1.4rem",
              }}
            >
              Reachy 2
            </Typography>
            <Typography
              sx={{
                fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.92)",
                fontWeight: 500,
                mb: "1rem",
                maxWidth: "34ch",
              }}
            >
              The first open-source humanoid robot designed for embodied AI and
              real-world applications.
            </Typography>
            <Typography sx={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.6, mb: "2.2rem", maxWidth: "40ch" }}>
              The ideal bimanual mobile manipulator for AI &amp; robotics labs.
            </Typography>
            <Box sx={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
              <Button href={GET_URL} target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
                Get your Reachy 2
              </Button>
              <Button
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.3)",
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.06)" },
                }}
              >
                Read the docs
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              borderRadius: "28px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              aspectRatio: "1 / 1",
              maxWidth: { xs: 460, md: "none" },
              mx: "auto",
              width: "100%",
              "& img": { width: "100%", height: "100%", objectFit: "cover", display: "block" },
            }}
          >
            <img src={`${ASSET}/full-robot.webp`} alt="Reachy 2 humanoid robot" />
          </Box>
        </Box>
      </Box>

      {/* Intro band */}
      <Box component="section" sx={{ bgcolor: "background.default" }}>
        <Box sx={{ maxWidth: 1000, mx: "auto", px: CONTENT_PX, py: { xs: 6, md: 9 }, textAlign: "center" }}>
          <Typography
            component="p"
            sx={{ fontSize: "clamp(1.4rem, 2.6vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3, mb: "1rem" }}
          >
            Fully open source. Teleoperated or controlled with Python. Runs on
            ROS&nbsp;2 Humble.
          </Typography>
          <Typography sx={{ fontSize: "1.1rem", color: "text.secondary", lineHeight: 1.6, maxWidth: "56ch", mx: "auto" }}>
            Jump straight into our Python SDK or VR teleoperation app and start
            prototyping.
          </Typography>
          <Box sx={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "center", mt: "1.8rem" }}>
            <Button href={SDK_URL} target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
              Explore the Python SDK
            </Button>
          </Box>
        </Box>
      </Box>

      {/* The frontier + demo video */}
      <Box component="section" sx={{ bgcolor: "background.paper" }}>
        <Box sx={{ maxWidth: 1280, mx: "auto", px: CONTENT_PX, py: { xs: 6, md: 10 } }}>
          <Box sx={{ maxWidth: "40ch", mb: { xs: 4, md: 6 } }}>
            <Eyebrow>The next frontier</Eyebrow>
            <Typography
              component="h2"
              sx={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.08, mb: "1rem" }}
            >
              Object manipulation in the real world.
            </Typography>
            <Typography sx={{ fontSize: "1.1rem", color: "text.secondary", lineHeight: 1.65 }}>
              Truly useful robots need to learn how to grasp and use objects from
              our everyday environments - the office, our homes, a hospital, a
              shop.
            </Typography>
          </Box>
          <MediaCard>
            <Box
              component="video"
              src={`${ASSET}/teleop.mp4`}
              autoPlay
              muted
              loop
              playsInline
              sx={{ aspectRatio: "unset" }}
            />
          </MediaCard>
        </Box>
      </Box>

      {/* Feature rows */}
      <Box component="section" sx={{ bgcolor: "background.default" }}>
        <Box sx={{ maxWidth: 1280, mx: "auto", px: CONTENT_PX }}>
          <FeatureRow
            eyebrow="VR teleoperation"
            title="Step inside the robot"
            body="Take control of Reachy 2 remotely using VR and our teleoperation application. Move its arms, hands and head, and see through Reachy's cameras to interact with the environment around the robot."
            media={
              <MediaCard>
                <img src={`${ASSET}/platform.webp`} alt="Reachy 2 teleoperation platform" loading="lazy" />
              </MediaCard>
            }
          />
          <FeatureRow
            reverse
            eyebrow="Manipulation"
            title="A modular, human-scale arm"
            body="With 7 degrees of freedom, Reachy 2's arms mirror the dimensions, proportions and movements of an adult human arm. One arm can lift objects up to 3 kg and manipulate them with real dexterity."
            media={
              <MediaCard>
                <img src={`${ASSET}/dual-arm.webp`} alt="Reachy 2 dual arm configuration" loading="lazy" />
              </MediaCard>
            }
          />
          <FeatureRow
            eyebrow="Mobility"
            title="Move around and explore"
            body="Reachy 2 is available on an omnidirectional mobile base for a wider working space. Three omniwheels, a cylinder-like structure, a suite of sensors and a LiDAR make navigation effortless."
            media={
              <MediaCard>
                <img src={`${ASSET}/dual-arm-mobile-base.webp`} alt="Reachy 2 on its mobile base" loading="lazy" />
              </MediaCard>
            }
          />
        </Box>
      </Box>

      {/* A machine that learns + specs */}
      <Box component="section" sx={{ bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider" }}>
        <Box sx={{ maxWidth: 1280, mx: "auto", px: CONTENT_PX, py: { xs: 6, md: 10 } }}>
          <Box sx={{ maxWidth: "48ch", mb: { xs: 4, md: 6 } }}>
            <Eyebrow>A machine that learns</Eyebrow>
            <Typography
              component="h2"
              sx={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.08, mb: "1rem" }}
            >
              Built for modern AI.
            </Typography>
            <Typography sx={{ fontSize: "1.1rem", color: "text.secondary", lineHeight: 1.65 }}>
              Reachy 2's CPU-powered system delivers strong performance and
              seamless compatibility with modern AI frameworks - everything you
              need to explore and implement new learning models.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 1.5, md: 2 },
            }}
          >
            <SpecItem value="7 DoF" label="Bio-inspired arms" />
            <SpecItem value="~3 kg" label="Payload per arm" />
            <SpecItem value="136-166 cm" label="Adjustable height" />
            <SpecItem value="Up to 50 kg" label="Full robot weight" />
            <SpecItem value="Orbita 2D/3D" label="Parallel actuators" />
            <SpecItem value="ROS 2 Humble" label="+ Python SDK" />
            <SpecItem value="Stereo + RGB-D" label="Vision & depth" />
            <SpecItem value="LiDAR" label="Omnidirectional base" />
          </Box>
        </Box>
      </Box>

      {/* Kits */}
      <Box component="section" sx={{ bgcolor: "background.default" }}>
        <Box sx={{ maxWidth: 1280, mx: "auto", px: CONTENT_PX, py: { xs: 6, md: 10 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Eyebrow>Configurations</Eyebrow>
            <Typography
              component="h2"
              sx={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.08 }}
            >
              Pick the right Reachy 2 kit.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
              gap: { xs: 2, md: 3 },
            }}
          >
            <KitCard img={`${ASSET}/dual-arm-mobile-base.webp`} config="Dual arm + base" name="Dual Arm + Mobile Base" />
            <KitCard img={`${ASSET}/single-arm-mobile-base.webp`} config="Single arm + base" name="Single Arm + Mobile Base" />
            <KitCard img={`${ASSET}/dual-arm.webp`} config="Dual arm" name="Dual Arm" />
            <KitCard img={`${ASSET}/single-arm.webp`} config="Single arm" name="Single Arm" />
          </Box>
        </Box>
      </Box>

      {/* Final CTA */}
      <Box component="section" sx={{ bgcolor: "#0a0a0b", color: "#fff" }}>
        <Box sx={{ maxWidth: 900, mx: "auto", px: CONTENT_PX, py: { xs: 8, md: 12 }, textAlign: "center" }}>
          <Typography
            component="h2"
            sx={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, mb: "1.2rem" }}
          >
            Bring Reachy 2 to your lab.
          </Typography>
          <Typography sx={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: "48ch", mx: "auto", mb: "2.2rem" }}>
            Open hardware, open software, and a growing community. Start building
            embodied AI on a robot you can fully own and extend.
          </Typography>
          <Box sx={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Button href={GET_URL} target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
              Get your Reachy 2
            </Button>
            <Button
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.06)" },
              }}
            >
              Read the docs
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
