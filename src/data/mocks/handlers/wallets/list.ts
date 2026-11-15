import { HttpResponse, type HttpResponseResolver } from "msw/http";
import type { AuthApiError } from "@/data/types/auth";
import type { WalletsResponse } from "@/data/types/wallets";
import { getSessionUser } from "../../database/sessions";
import { getWalletsByUserId } from "../../database/wallets";
import { simulateWalletRequest } from "../../scenarios/wallets";
import { requestSessionId, sessionCookie } from "../auth/utils";

export const listWalletsHandler: HttpResponseResolver<
  never,
  never,
  WalletsResponse | AuthApiError
> = async ({ request }) => {
  try {
    const scenario = await simulateWalletRequest(request);
    if (scenario instanceof Response) return scenario;

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

    return HttpResponse.json<WalletsResponse>({
      wallets: getWalletsByUserId(sessionUser.id),
    });
  } catch {
    return HttpResponse.json<AuthApiError>(
      { message: "Não foi possível carregar as carteiras." },
      { status: 503 },
    );
  }
};
