import { compileMDX } from "next-mdx-remote/rsc";
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Children = { children?: React.ReactNode };

// MDX elements are mapped onto MUI typography so posts inherit each zone's
// theme (fonts, colors) automatically.
const components = {
  h1: ({ children }: Children) => (
    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }: Children) => (
    <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 4, mb: 1.5 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }: Children) => (
    <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
      {children}
    </Typography>
  ),
  p: ({ children }: Children) => (
    <Typography sx={{ mb: 2, lineHeight: 1.7, color: "text.primary" }}>
      {children}
    </Typography>
  ),
  a: ({ href, children }: Children & { href?: string }) => (
    <MuiLink href={href} underline="hover" sx={{ color: "primary.main" }}>
      {children}
    </MuiLink>
  ),
  ul: ({ children }: Children) => (
    <Box component="ul" sx={{ pl: 3, mb: 2, lineHeight: 1.7 }}>
      {children}
    </Box>
  ),
  li: ({ children }: Children) => (
    <Box component="li" sx={{ mb: 0.5 }}>
      {children}
    </Box>
  ),
};

export default async function BlogPost({
  title,
  date,
  source,
  hero,
}: {
  title: string;
  date: string;
  source: string;
  hero?: React.ReactNode;
}) {
  const { content } = await compileMDX({
    source,
    components,
  });

  return (
    <>
      {hero}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box component="article">
          {!hero && (
            <>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                {title}
              </Typography>
              {date && (
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
                  {formatDate(date)}
                </Typography>
              )}
            </>
          )}
          {content}
        </Box>
      </Container>
    </>
  );
}
