import { createTheme } from "@mui/material/styles";

// Pollen brand landing theme: light, warm, DM Sans, orange accent.
const DM_SANS =
  'var(--font-dm-sans), "DM Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

const pollenTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FF9500",
      light: "#FFB340",
      dark: "#E08500",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1d1d1f",
      secondary: "#86868b",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  typography: {
    fontFamily: DM_SANS,
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { overflowX: "clip" },
        body: { overflowX: "clip" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 980,
          padding: "0.9rem 1.7rem",
          fontSize: "1rem",
          boxShadow: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": { boxShadow: "none" },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            background: "linear-gradient(135deg, #FF9500 0%, #FFB340 100%)",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0 10px 30px rgba(255, 149, 0, 0.3)",
            },
          },
        },
      ],
    },
  },
});

export default pollenTheme;
