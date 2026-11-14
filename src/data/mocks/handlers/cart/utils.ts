import { HttpResponse } from "msw/http";
import { z } from "zod";
import type { CartApiError } from "@/data/types/cart";
import { getSessionUser } from "../../database/sessions";
import { requestSessionId, sessionCookie } from "../auth/utils";

export const cartUser = (
  request: Request,
): { userId?: string } | HttpResponse<CartApiError> => {
  const sessionId = requestSessionId(request);
  if (!sessionId) return {};
  const user = getSessionUser(sessionId);
  if (user) return { userId: user.id };
  return HttpResponse.json<CartApiError>(
    {
      code: "SESSION_EXPIRED",
      message: "Sua sessão expirou. Entre novamente.",
    },
    { status: 401, headers: { "Set-Cookie": sessionCookie("", request, 0) } },
  );
};

export const cartStorageError = () =>
  HttpResponse.json<CartApiError>(
    {
      code: "STORAGE_UNAVAILABLE",
      message: "Não foi possível acessar o carrinho. Tente novamente.",
    },
    { status: 503 },
  );

export const readCartPayload = async <T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<{ data: T } | { response: HttpResponse<CartApiError> }> => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      response: HttpResponse.json<CartApiError>(
        { code: "INVALID_REQUEST", message: "Envie os dados em JSON válido." },
        { status: 400 },
      ),
    };
  }
  const result = schema.safeParse(body);
  if (result.success) return { data: result.data };
  const errors: CartApiError["errors"] = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field === "code") errors.couponCode ??= issue.message;
    if (field === "nftId" || field === "edition" || field === "quantity")
      errors[field] ??= issue.message;
  }
  return {
    response: HttpResponse.json<CartApiError>(
      {
        code: "VALIDATION_ERROR",
        message: "Confira os dados do item.",
        errors,
      },
      { status: 422 },
    ),
  };
};
