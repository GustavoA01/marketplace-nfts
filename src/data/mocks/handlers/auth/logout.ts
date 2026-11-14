import { HttpResponse, type HttpResponseResolver } from "msw/http";
import type { AuthApiError } from "@/data/types/auth";
import { deleteSession } from "../../database/sessions";
import { requestSessionId, sessionCookie } from "./utils";

export const logoutHandler: HttpResponseResolver = ({ request }) => {
  try {
    deleteSession(requestSessionId(request));
    return new HttpResponse(null, {
      status: 204,
      headers: { "Set-Cookie": sessionCookie("", request, 0) },
    });
  } catch {
    return HttpResponse.json<AuthApiError>(
      { message: "Não foi possível encerrar a sessão. Tente novamente." },
      { status: 503 },
    );
  }
};
