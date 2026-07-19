import type { ReactNode } from "react";
import { Box, Link as MuiLink } from "@mui/material";

/**
 * Hugging Face profile chip: avatar + display name + @username, linking to the
 * profile. Avatar comes from the public HF avatar endpoint.
 */
export function HfUser({
  username,
  name,
  url,
  avatarUrl,
}: {
  username: string;
  name?: string;
  url?: string;
  avatarUrl?: string;
}) {
  const profileUrl = url ?? `https://huggingface.co/${encodeURIComponent(username)}`;
  const displayName = name ?? username;
  const imgSrc =
    avatarUrl ?? `https://huggingface.co/api/users/${encodeURIComponent(username)}/avatar`;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        p: "10px 10px 10px 12px",
        borderRadius: "12px",
      }}
    >
      <Box
        component="img"
        src={imgSrc}
        alt={`${displayName} avatar`}
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        sx={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
      <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <MuiLink
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{ fontSize: 14, fontWeight: 700, color: "var(--article-text)" }}
        >
          {displayName}
        </MuiLink>
        <MuiLink
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ fontSize: 12, color: "var(--article-muted)" }}
        >
          @{username}
        </MuiLink>
      </Box>
    </Box>
  );
}

/** Flex-wrap container for a list of <HfUser /> chips. */
export function HfUserList({ children }: { children?: ReactNode }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px", my: 3 }}>{children}</Box>
  );
}
