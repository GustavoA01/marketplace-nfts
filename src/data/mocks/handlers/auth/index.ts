import { http } from "msw/http";
import type { LoginFormValues, SignUpFormValues } from "@/data/schemas/auth";
import type {
  AuthApiError,
  LoginResponse,
  RegisterResponse,
  SessionResponse,
} from "@/data/types/auth";
import { loginHandler } from "./login";
import { logoutHandler } from "./logout";
import { registerHandler } from "./register";
import { sessionHandler } from "./session";
import { authPrefix } from "./utils";

export const authHandlers = [
  http.post<never, SignUpFormValues, RegisterResponse | AuthApiError>(
    `${authPrefix}/register`,
    registerHandler,
  ),
  http.post<never, LoginFormValues, LoginResponse | AuthApiError>(
    `${authPrefix}/login`,
    loginHandler,
  ),
  http.get<never, never, SessionResponse | AuthApiError>(
    `${authPrefix}/session`,
    sessionHandler,
  ),
  http.delete(`${authPrefix}/logout`, logoutHandler),
];
