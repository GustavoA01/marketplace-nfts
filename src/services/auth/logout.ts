import { http } from "@/lib/http";
import { clearAuthCookie } from "@/lib/auth-cookie";

export const logoutUser = async () => {
  try {
    await http.delete("/auth/logout");
  } finally {
    clearAuthCookie();
  }
};
