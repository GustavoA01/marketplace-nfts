import { HttpResponse, type HttpResponseResolver } from "msw/http";
import type { AuthApiError } from "@/data/types/auth";
import type { ProfileResponse } from "@/data/types/profile";
import { getUserById, toCollectorProfile } from "../../database/users";
import { getSessionUser } from "../../database/sessions";
import { requestSessionId, sessionCookie } from "../auth/utils";

export const getProfileHandler: HttpResponseResolver<
  never,
  never,
  ProfileResponse | AuthApiError
> = ({ request }) => {
  try {
    const sessionUser = getSessionUser(requestSessionId(request));
    if (!sessionUser) {
      return HttpResponse.json<AuthApiError>(
        { message: "Entre na sua conta para continuar." },
        {
          status: 401,
          headers: { "Set-Cookie": sessionCookie("", request, 0) },
        },
      );
    }

    const user = getUserById(sessionUser.id);
    if (!user) {
      return HttpResponse.json<AuthApiError>(
        { message: "Perfil não encontrado." },
        { status: 404 },
      );
    }

    return HttpResponse.json<ProfileResponse>({
      profile: toCollectorProfile(user),
    });
  } catch {
    return HttpResponse.json<AuthApiError>(
      { message: "Não foi possível carregar o perfil." },
      { status: 503 },
    );
  }
};
