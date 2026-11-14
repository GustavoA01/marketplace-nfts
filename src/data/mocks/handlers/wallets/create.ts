import { HttpResponse, type HttpResponseResolver } from "msw/http";
import { z } from "zod";
import {
  createWalletSchema,
  type WalletFormValues,
} from "@/data/schemas/wallets";
import type { AuthApiError } from "@/data/types/auth";
import type {
  CreateWalletPayload,
  WalletApiError,
  WalletResponse,
} from "@/data/types/wallets";
import { getSessionUser } from "../../database/sessions";
import { createWallet } from "../../database/wallets";
import { requestSessionId, sessionCookie } from "../auth/utils";

export const createWalletHandler: HttpResponseResolver<
  never,
  CreateWalletPayload,
  WalletResponse | WalletApiError | AuthApiError
> = async ({ request }) => {
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

    const result = createWalletSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      const errors: WalletApiError["errors"] = {};
      for (const field of Object.keys(fieldErrors) as Array<
        keyof WalletFormValues | "kind"
      >) {
        const message = fieldErrors[field]?.[0];
        if (message) errors[field] = message;
      }
      return HttpResponse.json<WalletApiError>(
        { message: "Confira os dados da carteira.", errors },
        { status: 422 },
      );
    }

    const created = createWallet(sessionUser.id, result.data);
    if ("conflict" in created) {
      return HttpResponse.json<WalletApiError>(
        {
          message:
            result.data.kind === "main"
              ? "Você já possui uma carteira principal."
              : "Você já possui uma carteira secundária.",
          errors: { kind: "Esta função de carteira já está cadastrada." },
        },
        { status: 409 },
      );
    }

    return HttpResponse.json<WalletResponse>(
      { wallet: created },
      { status: 201 },
    );
  } catch {
    return HttpResponse.json<WalletApiError>(
      { message: "Não foi possível salvar a carteira. Tente novamente." },
      { status: 503 },
    );
  }
};
