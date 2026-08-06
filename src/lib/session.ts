/**
 * Session helpers — keeps intro-played state in sessionStorage so the
 * cinematic intro only fires once per browser session.
 *
 * All methods guard against SSR (Node.js) where sessionStorage doesn't exist.
 */

const INTRO_KEY = "heritage_intro_played";
const AUTHENTICATED_KEY = "heritage_authenticated";

/** Returns true only when running in a real browser environment */
const isBrowser = () => typeof window !== "undefined" && typeof sessionStorage !== "undefined";

export const session = {
  /** Mark the user as authenticated this session */
  setAuthenticated() {
    if (!isBrowser()) return;
    sessionStorage.setItem(AUTHENTICATED_KEY, "1");
  },

  /** Returns true if the user has logged in this session */
  isAuthenticated(): boolean {
    if (!isBrowser()) return false;
    return sessionStorage.getItem(AUTHENTICATED_KEY) === "1";
  },

  /** Mark the intro video as already played */
  markIntroPlayed() {
    if (!isBrowser()) return;
    sessionStorage.setItem(INTRO_KEY, "1");
  },

  /** Returns true if the intro has already been played this session */
  hasPlayedIntro(): boolean {
    if (!isBrowser()) return false;
    return sessionStorage.getItem(INTRO_KEY) === "1";
  },

  /** Clear all session data (on logout / session end) */
  clear() {
    if (!isBrowser()) return;
    sessionStorage.removeItem(INTRO_KEY);
    sessionStorage.removeItem(AUTHENTICATED_KEY);
  },
};
