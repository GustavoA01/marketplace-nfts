import {
  authTokenHeader,
  sessionCookieName,
  sessionDurationSeconds,
} from "@/data/constants/auth";

export { authTokenHeader };

export const writeAuthCookie = (sessionId: string) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${sessionCookieName}=${encodeURIComponent(sessionId)}; Path=/; SameSite=Lax; Max-Age=${sessionDurationSeconds}${secure}`;
};

export const clearAuthCookie = () => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${sessionCookieName}=; Path=/; SameSite=Lax; Max-Age=0${secure}`;
};

export const readAuthCookie = () => {
  const prefix = `${sessionCookieName}=`;
  for (const part of document.cookie.split(";")) {
    const entry = part.trim();
    if (!entry.startsWith(prefix)) continue;
    const value = entry.slice(prefix.length);
    if (!value) return undefined;
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return undefined;
};
