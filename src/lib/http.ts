import axios from "axios";
import { authTokenHeader, readAuthCookie } from "@/lib/auth-cookie";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15_000,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token = readAuthCookie();
  if (token) config.headers.set(authTokenHeader, token);
  return config;
});
