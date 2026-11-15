import { HttpResponse, type HttpResponseResolver } from "msw/http";
import { z } from "zod";
import { walletSchema, type WalletFormValues } from "@/data/schemas/wallets";
import type { AuthApiError } from "@/data/types/auth";
import type {
  UpdateWalletPayload,
  WalletApiError,
  WalletResponse,
} from "@/data/types/wallets";
import { getSessionUser } from "../../database/sessions";
import { updateWallet } from "../../database/wallets";
import { simulateWalletRequest } from "../../scenarios/wallets";
import { requestSessionId, sessionCookie } from "../auth/utils";

export const updateWalletHandler: HttpResponseResolver<
  { id: string },
  UpdateWalletPayload,
  WalletResponse | WalletApiError | AuthApiError
> = async ({ params, request }) => {
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return HttpResponse.json<WalletApiError>(
        { message: "Envie os dados em JSON válido." },
        { status: 400 },
      );
    }

    if (
      body &&
      typeof body === "object" &&
      "userId" in body &&
      (body as { userId?: unknown }).userId !== undefined
    ) {
      return HttpResponse.json<WalletApiError>(
        { message: "Não envie o identificador do usuário no formulário." },
        { status: 400 },
      );
    }

    const result = walletSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      const errors: WalletApiError["errors"] = {};
      for (const field of Object.keys(
        fieldErrors,
      ) as (keyof WalletFormValues)[]) {
        const message = fieldErrors[field]?.[0];
        if (message) errors[field] = message;
      }
      return HttpResponse.json<WalletApiError>(
        { message: "Confira os dados da carteira.", errors },
        { status: 422 },
      );
    }

    const walletId = Array.isArray(params.id) ? params.id[0] : params.id;
    const updated = updateWallet(sessionUser.id, walletId, result.data);
    if (!updated) {
      return HttpResponse.json<WalletApiError>(
        { message: "Carteira não encontrada." },
        { status: 404 },
      );
    }

    return HttpResponse.json<WalletResponse>({ wallet: updated });
  } catch {
    return HttpResponse.json<WalletApiError>(
      { message: "Não foi possível salvar a carteira. Tente novamente." },
      { status: 503 },
    );
  }
};
