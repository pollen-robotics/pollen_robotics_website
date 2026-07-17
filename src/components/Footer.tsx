import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

const LINKS = [
  { label: "Hugging Face", href: "https://huggingface.co/pollen-robotics" },
  { label: "GitHub", href: "https://github.com/pollen-robotics" },
  { label: "Discord", href: "https://discord.gg/2bAhWfXme9" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        py: 4,
        mt: "auto",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          © {new Date().getFullYear()} Pollen Robotics
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          {LINKS.map((l) => (
            <MuiLink
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: "text.secondary", fontSize: 14, fontWeight: 500 }}
            >
              {l.label}
            </MuiLink>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
