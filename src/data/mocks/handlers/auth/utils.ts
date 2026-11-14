import { authTokenHeader, sessionCookieName } from "@/data/constants/auth";

export const authPrefix = "/api/auth";

export const sessionCookie = (
  value: string,
  request: Request,
  maxAge: number,
) =>
  `${sessionCookieName}=${value}; Path=/; SameSite=Lax; Max-Age=${maxAge}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;

export const requestSessionId = (request: Request) => {
  const fromHeader = request.headers.get(authTokenHeader);
  if (fromHeader) return fromHeader;

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name !== sessionCookieName) continue;
    const value = rest.join("=");
    if (!value) return undefined;
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return undefined;
};
