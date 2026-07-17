"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { oauthLoginUrl, oauthHandleRedirectIfPresent } from "@huggingface/hub";

const HF_API = "https://huggingface.co";

// Whether we're running inside an iframe (i.e. embedded on huggingface.co).
const isInIframe =
  typeof window !== "undefined" && window.parent !== window;

// API base for the (optional) server fallback. Points at the Reachy Mini API
// Space so the OAuth config endpoint can be reached from the browser.
const API_BASE =
  process.env.NEXT_PUBLIC_REACHY_API_BASE ||
  "https://pollen-robotics-reachy-mini.hf.space";

interface OAuthConfig {
  clientId: string;
  scopes: string;
}

interface AuthUser {
  name: string;
  preferredUsername: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isOAuthAvailable: boolean;
  isInIframe: boolean;
  likedSpaceIds: Set<string>;
  login: () => Promise<void>;
  logout: () => void;
  isSpaceLiked: (spaceId?: string) => boolean;
  toggleLike: (spaceId?: string) => Promise<void>;
}

declare global {
  interface Window {
    huggingface?: {
      variables?: {
        OAUTH_CLIENT_ID?: string;
        OAUTH_SCOPES?: string;
        [key: string]: string | undefined;
      };
    };
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Resolve OAuth config (clientId, scopes).
 *
 * On a static HF Space with `hf_oauth: true`, the platform injects the values
 * into `window.huggingface.variables`, so we read them directly. We keep a
 * fetch to `${API_BASE}/api/oauth-config` as a fallback for Docker/other hosts.
 */
async function fetchOAuthConfig(): Promise<OAuthConfig | null> {
  const injected =
    typeof window !== "undefined" ? window.huggingface?.variables : null;
  if (injected?.OAUTH_CLIENT_ID) {
    return {
      clientId: injected.OAUTH_CLIENT_ID,
      scopes: injected.OAUTH_SCOPES || "openid profile",
    };
  }
  try {
    const response = await fetch(`${API_BASE}/api/oauth-config`);
    if (!response.ok) return null;
    return (await response.json()) as OAuthConfig;
  } catch {
    return null;
  }
}

/**
 * Fetch all space IDs liked by a user.
 * Returns a Set of lowercase space IDs.
 */
async function fetchUserLikedSpaces(username: string): Promise<Set<string>> {
  try {
    const response = await fetch(`${HF_API}/api/users/${username}/likes`);
    if (!response.ok) return new Set();
    const likes = (await response.json()) as Array<{
      repo?: { type?: string; name?: string };
    }>;
    return new Set(
      likes
        .filter((item) => item.repo?.type === "space")
        .map((item) => (item.repo?.name || "").toLowerCase())
    );
  } catch (err) {
    console.error("[Auth] Failed to fetch user likes:", err);
    return new Set();
  }
}

/**
 * Send a like request to the HF parent frame via postMessage.
 * The parent frame (huggingface.co) handles auth via session cookies.
 */
function likeViaPostMessage(
  spaceId: string
): Promise<{ error?: { code: string; message: string }; status?: string; likes?: number }> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      window.removeEventListener("message", handler);
      reject(new Error("Like request timed out"));
    }, 5000);

    function handler(event: MessageEvent) {
      if (event.data?.type !== "LIKE_REPO_RESPONSE") return;
      clearTimeout(timeout);
      window.removeEventListener("message", handler);
      resolve(event.data);
    }

    window.addEventListener("message", handler);
    window.parent.postMessage(
      { type: "LIKE_REPO_REQUEST", repo: { type: "space", name: spaceId } },
      "*"
    );
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [likedSpaceIds, setLikedSpaceIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [oauthConfig, setOauthConfig] = useState<OAuthConfig | null>(null);
  const pendingLikes = useRef<Set<string>>(new Set());

  // On mount: fetch OAuth config + check if user just completed OAuth redirect.
  useEffect(() => {
    async function init() {
      try {
        const config = await fetchOAuthConfig();
        if (config?.clientId) {
          setOauthConfig(config);
        }

        const oauthResult = await oauthHandleRedirectIfPresent();
        if (oauthResult) {
          const { userInfo } = oauthResult;
          const userData: AuthUser = {
            name: userInfo.name,
            preferredUsername: userInfo.preferred_username || userInfo.name,
            avatarUrl: userInfo.picture,
          };
          setUser(userData);

          const likes = await fetchUserLikedSpaces(userData.preferredUsername);
          setLikedSpaceIds(likes);
        }
      } catch (err) {
        console.error("[Auth] Init error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  const login = useCallback(async () => {
    if (!oauthConfig?.clientId) {
      console.warn("[Auth] Cannot login: OAuth not configured");
      return;
    }
    try {
      const loginUrl = await oauthLoginUrl({
        clientId: oauthConfig.clientId,
        scopes: oauthConfig.scopes || "openid profile",
      });
      window.location.href = loginUrl;
    } catch (err) {
      console.error("[Auth] Failed to get OAuth URL:", err);
    }
  }, [oauthConfig]);

  const logout = useCallback(() => {
    setUser(null);
    setLikedSpaceIds(new Set());
  }, []);

  const isSpaceLiked = useCallback(
    (spaceId?: string) => likedSpaceIds.has((spaceId || "").toLowerCase()),
    [likedSpaceIds]
  );

  /**
   * Like a space via the HF parent frame postMessage protocol.
   * Like-only (no unlike) - if already liked, it's a no-op.
   */
  const toggleLike = useCallback(
    async (spaceId?: string) => {
      const spaceIdLower = (spaceId || "").toLowerCase();
      if (!spaceIdLower || !spaceId) return;

      if (likedSpaceIds.has(spaceIdLower)) return;

      if (!isInIframe) {
        console.warn("[Auth] Not in iframe, postMessage unavailable");
        return;
      }

      if (pendingLikes.current.has(spaceIdLower)) return;
      pendingLikes.current.add(spaceIdLower);

      setLikedSpaceIds((prev) => {
        const next = new Set(prev);
        next.add(spaceIdLower);
        return next;
      });

      try {
        const result = await likeViaPostMessage(spaceId);

        if (result.error) {
          throw new Error(`${result.error.code}: ${result.error.message}`);
        }
        if (result.status === "not_logged_in") {
          throw new Error("not_logged_in");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[Auth] Failed to like ${spaceId}:`, message);

        setLikedSpaceIds((prev) => {
          const reverted = new Set(prev);
          reverted.delete(spaceIdLower);
          return reverted;
        });

        if (message === "not_logged_in") {
          login();
        }
      } finally {
        pendingLikes.current.delete(spaceIdLower);
      }
    },
    [likedSpaceIds, login]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        isOAuthAvailable: !!oauthConfig?.clientId,
        isInIframe,
        likedSpaceIds,
        login,
        logout,
        isSpaceLiked,
        toggleLike,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
