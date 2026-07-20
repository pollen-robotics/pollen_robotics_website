"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Box, Collapse } from "@mui/material";

/**
 * Table of Contents, ported 1:1 (behaviour + look) from the
 * research-article-template `TableOfContents.astro`:
 *   - Desktop: a sticky aside built from the article's h2/h3/h4, with the
 *     current section highlighted on scroll.
 *   - Mobile: a floating toggle that opens a slide-in sidebar with the same
 *     tree, closing on link click / backdrop / Escape.
 *
 * Colors come from the article CSS variables injected by ArticleThemeScope.
 */

type TocNode = {
  id: string;
  text: string;
  level: number;
  children: TocNode[];
};

const SCROLL_OFFSET_PX = 100;

function buildTree(items: { id: string; text: string; level: number }[]): TocNode[] {
  const root: TocNode = { id: "", text: "", level: 1, children: [] };
  const stack: TocNode[] = [root];
  for (const it of items) {
    const node: TocNode = { ...it, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= it.level) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return root.children;
}

/**
 * Return the id path (ancestors + node itself) from the tree root down to the
 * node matching `id`, or an empty array if not found. Used to decide which
 * branches stay expanded in auto-collapse mode.
 */
function findPath(nodes: TocNode[], id: string): string[] {
  for (const n of nodes) {
    if (n.id === id) return [n.id];
    const sub = findPath(n.children, id);
    if (sub.length) return [n.id, ...sub];
  }
  return [];
}

/**
 * Shared hook: reads the article headings once mounted, builds the tree and
 * tracks the currently-visible section on scroll.
 */
function useToc() {
  const [tree, setTree] = useState<TocNode[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;
    const headings = Array.from(
      article.querySelectorAll<HTMLElement>("h2, h3, h4")
    ).filter((h) => (h.textContent || "").trim().length > 0);
    if (headings.length < 2) return;

    // rehype-slug gives ids, but guard against any missing/duplicate ones.
    const used = new Set<string>();
    const slugify = (s: string) =>
      s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "");
    for (const h of headings) {
      let id = (h.id || "").trim() || slugify(h.textContent || "") || "section";
      let candidate = id;
      let n = 2;
      while (used.has(candidate)) candidate = `${id}-${n++}`;
      if (h.id !== candidate) h.id = candidate;
      used.add(candidate);
    }

    const levelOf = (tag: string) => (tag === "H2" ? 2 : tag === "H3" ? 3 : 4);
    setTree(
      buildTree(
        headings.map((h) => ({
          id: h.id,
          text: h.textContent || "",
          level: levelOf(h.tagName),
        }))
      )
    );

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        let current = headings[0].id;
        for (let i = headings.length - 1; i >= 0; i--) {
          if (headings[i].getBoundingClientRect().top - SCROLL_OFFSET_PX <= 0) {
            current = headings[i].id;
            break;
          }
        }
        setActiveId(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { tree, activeId };
}

function TocList({
  nodes,
  activeId,
  expandedSet,
  collapsible,
  depth = 0,
  onNavigate,
}: {
  nodes: TocNode[];
  activeId: string;
  /** Ids whose child branch must stay open (active section + ancestors). */
  expandedSet: Set<string>;
  /** When false, everything is expanded (used on mobile). */
  collapsible: boolean;
  depth?: number;
  onNavigate?: () => void;
}) {
  return (
    <Box
      component="ul"
      sx={{
        listStyle: "none",
        m: depth === 0 ? "0 0 6px" : "4px 0 6px",
        pl: depth === 0 ? 0 : "1em",
      }}
    >
      {nodes.map((node) => {
        const isActive = node.id === activeId;
        const hasChildren = node.children.length > 0;
        const childList = hasChildren ? (
          <TocList
            nodes={node.children}
            activeId={activeId}
            expandedSet={expandedSet}
            collapsible={collapsible}
            depth={depth + 1}
            onNavigate={onNavigate}
          />
        ) : null;
        return (
          <Box component="li" key={node.id} sx={{ m: "0.3em 0" }}>
            <Box
              component="a"
              href={`#${node.id}`}
              onClick={onNavigate}
              sx={{
                display: "block",
                color: isActive ? "var(--article-primary)" : "var(--article-text)",
                textDecoration: isActive ? "underline" : "none",
                textDecorationColor: isActive
                  ? "color-mix(in srgb, var(--article-primary) 50%, transparent)"
                  : undefined,
                textUnderlineOffset: "2px",
                fontWeight: depth === 0 ? 700 : 400,
                lineHeight: 1.5,
                transition: "color 120ms ease",
                "&:hover": {
                  textDecoration: "underline",
                  textDecorationColor: "var(--article-muted)",
                },
              }}
            >
              {node.text}
            </Box>
            {hasChildren &&
              (collapsible ? (
                <Collapse in={expandedSet.has(node.id)} timeout={200} unmountOnExit={false}>
                  {childList}
                </Collapse>
              ) : (
                childList
              ))}
          </Box>
        );
      })}
    </Box>
  );
}

/** Desktop sticky aside — lives in the article's left gutter column. */
export function TocDesktop() {
  const { tree, activeId } = useToc();
  if (tree.length === 0) return null;
  // Auto-collapse: keep only the active section's branch (itself + ancestors)
  // expanded, matching the research-article-template default behaviour.
  const expandedSet = new Set(findPath(tree, activeId));
  return (
    <Box
      component="nav"
      aria-label="Table of Contents"
      sx={{
        position: "sticky",
        // Sit a little below the sticky chrome (Pollen strip + Reachy header
        // ~132px) so the TOC isn't glued to the very top once scrolled.
        top: 168,
        borderLeft: "1px solid var(--article-border)",
        pl: 2,
        fontSize: 13,
      }}
    >
      <Box sx={{ fontWeight: 600, fontSize: 14, mb: 1, color: "var(--article-text)" }}>
        Table of Contents
      </Box>
      <TocList nodes={tree} activeId={activeId} expandedSet={expandedSet} collapsible />
    </Box>
  );
}

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/** Mobile: floating toggle + slide-in sidebar. Rendered outside the grid. */
export function TocMobile() {
  const { tree, activeId } = useToc();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (tree.length === 0) return null;

  const close = (e?: MouseEvent) => {
    e?.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <Box
        component="button"
        aria-label="Open table of contents"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        sx={{
          display: { xs: "flex", lg: "none" },
          position: "fixed",
          bottom: 20,
          left: 20,
          zIndex: 1200,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid var(--article-border)",
          background: "var(--page-bg)",
          color: "var(--article-text)",
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,.15)",
          transition: "transform 150ms ease",
          "&:active": { transform: "scale(0.92)" },
        }}
      >
        <MenuIcon />
      </Box>

      <Box
        onClick={close}
        aria-hidden
        sx={{
          display: { xs: "block", lg: "none" },
          position: "fixed",
          inset: 0,
          zIndex: 1300,
          background: "rgba(0,0,0,.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 250ms ease",
        }}
      />

      <Box
        component="aside"
        aria-label="Table of Contents"
        sx={{
          display: { xs: "flex", lg: "none" },
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1400,
          width: "min(320px, 85vw)",
          background: "var(--page-bg)",
          borderRight: "1px solid var(--article-border)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(.4,0,.2,1)",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
            borderBottom: "1px solid var(--article-border)",
            flexShrink: 0,
          }}
        >
          <Box sx={{ fontWeight: 700, fontSize: 15, color: "var(--article-text)" }}>
            Table of Contents
          </Box>
          <Box
            component="button"
            aria-label="Close table of contents"
            onClick={close}
            sx={{
              background: "none",
              border: "none",
              color: "var(--article-muted)",
              cursor: "pointer",
              p: 0.75,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { color: "var(--article-text)", background: "var(--article-surface)" },
            }}
          >
            <CloseIcon />
          </Box>
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2, fontSize: 14 }}>
          <TocList
            nodes={tree}
            activeId={activeId}
            expandedSet={new Set()}
            collapsible={false}
            onNavigate={() => setOpen(false)}
          />
        </Box>
      </Box>
    </>
  );
}
