// Build-time feature flags. NEXT_PUBLIC_* values are inlined at build time,
// so this module is safe to import from both server and client components.

// The Reachy Mini blog ships on staging but is hidden in production until
// the content is ready. Set NEXT_PUBLIC_DISABLE_REACHY_BLOG=1 to hide it.
export const REACHY_BLOG_ENABLED =
  process.env.NEXT_PUBLIC_DISABLE_REACHY_BLOG !== "1";
