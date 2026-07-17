import { createTheme } from "@mui/material/styles";

// Reachy 2 theme: a premium, lab-grade look for the full-size open-source
// humanoid. Light content surfaces with a deep near-black hero, DM Sans, and
// the Pollen orange accent to stay within the family.
const DM_SANS =
  'var(--font-dm-sans), "DM Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif';

const reachy2Theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FF9500",
      light: "#FFB340",
      dark: "#E08500",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0a0a0b",
      secondary: "#5f6169",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  typography: {
    fontFamily: DM_SANS,
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { overflowX: "hidden" },
        body: { overflowX: "hidden" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 980,
          padding: "0.85rem 1.7rem",
          fontSize: "0.98rem",
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

export default reachy2Theme;
