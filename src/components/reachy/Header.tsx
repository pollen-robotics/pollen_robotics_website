"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Link as MuiLink,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const BASE = "/reachy-mini";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { label: "Get Started", href: `${BASE}/getting-started` },
  { label: "Download", href: `${BASE}/download` },
  { label: "Apps", href: `${BASE}/apps` },
  { label: "Blog", href: `${BASE}/blog` },
  { label: "Create", href: "https://huggingface.co/docs/reachy_mini/index", external: true },
  {
    label: "FAQ",
    href: "https://huggingface.co/docs/reachy_mini/troubleshooting",
    external: true,
  },
  { label: "Community", href: "https://discord.gg/2bAhWfXme9", external: true },
];

export default function ReachyHeader({ transparent = false }: { transparent?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => setMobileOpen((v) => !v);
  const handleNavClick = () => setMobileOpen(false);

  const isTransparentMode = transparent && !scrolled;
  const textColor = isTransparentMode ? "white" : "text.primary";
  const bgColor = isTransparentMode ? "transparent" : "rgba(255, 255, 255, 0.85)";
  const backdropFilter = isTransparentMode ? "none" : "saturate(180%) blur(20px)";

  const drawer = (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src="/assets/logo.svg"
            alt="Reachy Mini"
            sx={{ width: 28, height: 28 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Reachy Mini
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ "& .MuiListItem-root": { mb: 0.5 } }}>
        {navItems.map((item) => {
          const sx = {
            py: 1.5,
            px: 2,
            borderRadius: 2,
            "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
          } as const;
          const content = (
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                  {item.external && <OpenInNewIcon sx={{ fontSize: 14, opacity: 0.5 }} />}
                </Box>
              }
            />
          );
          return (
            <ListItem key={item.label} disablePadding>
              {item.external ? (
                <ListItemButton
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleNavClick}
                  sx={sx}
                >
                  {content}
                </ListItemButton>
              ) : (
                <ListItemButton component={Link} href={item.href} onClick={handleNavClick} sx={sx}>
                  {content}
                </ListItemButton>
              )}
            </ListItem>
          );
        })}
        <ListItem disablePadding sx={{ mt: 3 }}>
          <Button
            component={Link}
            href={`${BASE}/buy`}
            variant="contained"
            fullWidth
            size="large"
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            Order Now
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: "44px",
          backgroundColor: bgColor,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          borderBottom: isTransparentMode ? "none" : "1px solid rgba(0, 0, 0, 0.06)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: scrolled ? { xs: 1, md: 1.5, lg: 2 } : { xs: 2, md: 3, lg: 4 },
            py: scrolled ? { xs: 1, md: 1.5 } : { xs: 2, md: 3.5 },
            minHeight: scrolled ? { xs: 56, md: 64 } : { xs: 64, md: 88 },
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Box
            component={Link}
            href={BASE}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: scrolled ? 1 : 1.5,
              textDecoration: "none",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <Box
              component="img"
              src="/assets/reachy-icon.svg"
              alt="Reachy Mini"
              sx={{
                width: scrolled ? 52 : 60,
                height: scrolled ? 52 : 60,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: textColor,
                letterSpacing: "-0.03em",
                fontSize: scrolled ? { xs: 18, md: 19 } : { xs: 20, md: 22 },
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Reachy Mini
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              aria-label="open menu"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                color: textColor,
                backgroundColor: isTransparentMode ? "rgba(255,255,255,0.1)" : "transparent",
                "&:hover": {
                  backgroundColor: isTransparentMode
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.04)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: { md: 4, lg: 5 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: { md: 3, lg: 4 } }}>
                {navItems.map((item) =>
                  item.external ? (
                    <MuiLink
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: textColor,
                        textDecoration: "none",
                        fontSize: 15,
                        fontWeight: 500,
                        opacity: 0.85,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        transition: "opacity 0.2s",
                        whiteSpace: "nowrap",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item.label}
                      <OpenInNewIcon sx={{ fontSize: 13, opacity: 0.6 }} />
                    </MuiLink>
                  ) : (
                    <Typography
                      key={item.label}
                      component={Link}
                      href={item.href}
                      onClick={handleNavClick}
                      sx={{
                        color: textColor,
                        textDecoration: pathname === item.href ? "underline" : "none",
                        textUnderlineOffset: 6,
                        textDecorationThickness: 2,
                        fontSize: 15,
                        fontWeight: pathname === item.href ? 600 : 500,
                        opacity: pathname === item.href ? 1 : 0.85,
                        transition: "opacity 0.2s",
                        whiteSpace: "nowrap",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item.label}
                    </Typography>
                  )
                )}
              </Box>

              <Button
                component={Link}
                href={`${BASE}/buy`}
                variant={scrolled ? "contained" : "outlined"}
                color="primary"
                sx={{
                  px: 3,
                  py: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 2,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  ...(isTransparentMode && {
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      borderColor: "primary.light",
                      backgroundColor: "rgba(255,149,0,0.1)",
                    },
                  }),
                }}
              >
                Order Now
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": { width: 300, borderRadius: "16px 0 0 16px" },
        }}
      >
        {drawer}
      </Drawer>

      {!transparent && <Toolbar sx={{ minHeight: { xs: 64, md: 88 } }} />}
    </>
  );
}
