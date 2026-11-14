import { HttpResponse, type HttpResponseResolver } from "msw/http";
import { z } from "zod";
import { sessionDurationSeconds } from "@/data/constants/auth";
import { loginSchema, type LoginFormValues } from "@/data/schemas/auth";
import type { AuthApiError, LoginResponse } from "@/data/types/auth";
import { createSession, deleteSession } from "../../database/sessions";
import { mergeVisitorCart } from "../../database/cart";
import { authenticateUser } from "../../database/users";
import { requestSessionId, sessionCookie } from "./utils";

export const loginHandler: HttpResponseResolver<
  never,
  LoginFormValues,
  LoginResponse | AuthApiError
> = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return HttpResponse.json<AuthApiError>(
      { message: "Envie os dados em JSON válido." },
      { status: 400 },
    );
  }

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    const errors: AuthApiError["errors"] = {};
    for (const field of Object.keys(fieldErrors) as (keyof LoginFormValues)[]) {
      const message = fieldErrors[field]?.[0];
      if (message) errors[field] = message;
    }
    return HttpResponse.json<AuthApiError>(
      { message: "Confira os dados de acesso.", errors },
      { status: 422 },
    );
  }

  try {
    const user = await authenticateUser(
      result.data.email,
      result.data.password,
    );
    if (!user) {
      const message = "E-mail ou senha inválidos.";
      return HttpResponse.json<AuthApiError>(
        {
          message,
          errors: { email: message, password: message },
        },
        { status: 401 },
      );
    }

    mergeVisitorCart(user.id);
    deleteSession(requestSessionId(request));
    const session = createSession(user.id);

    return HttpResponse.json<LoginResponse>(
      { user, sessionId: session.id },
      {
        status: 200,
        headers: {
          "Set-Cookie": sessionCookie(
            session.id,
            request,
            sessionDurationSeconds,
          ),
        },
      },
    );
  } catch {
    return HttpResponse.json<AuthApiError>(
      { message: "Não foi possível entrar. Tente novamente." },
      { status: 503 },
    );
  }
};
