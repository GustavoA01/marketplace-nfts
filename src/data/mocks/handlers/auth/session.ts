import { HttpResponse, type HttpResponseResolver } from "msw/http";
import type { AuthApiError, SessionResponse } from "@/data/types/auth";
import { getSessionUser } from "../../database/sessions";
import { requestSessionId, sessionCookie } from "./utils";

export const sessionHandler: HttpResponseResolver<
  never,
  never,
  SessionResponse | AuthApiError
> = ({ request }) => {
  try {
    const user = getSessionUser(requestSessionId(request));
    if (!user) {
      return HttpResponse.json<AuthApiError>(
        { message: "Entre na sua conta para continuar." },
        {
          status: 401,
          headers: { "Set-Cookie": sessionCookie("", request, 0) },
        },
      );
    }
    return HttpResponse.json<SessionResponse>({ user });
  } catch {
    return HttpResponse.json<AuthApiError>(
      { message: "Não foi possível consultar a sessão." },
      { status: 503 },
    );
  }
};
