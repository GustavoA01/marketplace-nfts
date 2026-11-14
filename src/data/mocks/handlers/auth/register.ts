import { HttpResponse, type HttpResponseResolver } from "msw/http";
import { z } from "zod";
import { signUpSchema, type SignUpFormValues } from "@/data/schemas/auth";
import type { AuthApiError, RegisterResponse } from "@/data/types/auth";
import { createUser } from "../../database/users";

export const registerHandler: HttpResponseResolver<
  never,
  SignUpFormValues,
  RegisterResponse | AuthApiError
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

  const result = signUpSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    const errors: AuthApiError["errors"] = {};
    for (const field of Object.keys(
      fieldErrors,
    ) as (keyof SignUpFormValues)[]) {
      const message = fieldErrors[field]?.[0];
      if (message) errors[field] = message;
    }
    return HttpResponse.json<AuthApiError>(
      { message: "Confira os dados do cadastro.", errors },
      { status: 422 },
    );
  }

  try {
    const user = await createUser(result.data);
    if (!user) {
      const message = "Este e-mail já está cadastrado.";
      return HttpResponse.json<AuthApiError>(
        { message, errors: { email: message } },
        { status: 409 },
      );
    }
    return HttpResponse.json<RegisterResponse>({ user }, { status: 201 });
  } catch {
    return HttpResponse.json<AuthApiError>(
      { message: "Não foi possível salvar o cadastro. Tente novamente." },
      { status: 503 },
    );
  }
};
