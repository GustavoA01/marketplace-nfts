import { HttpResponse, type HttpResponseResolver } from "msw/http";
import { z } from "zod";
import { profileSchema, type ProfileFormValues } from "@/data/schemas/profile";
import type { AuthApiError } from "@/data/types/auth";
import type {
  ProfileApiError,
  ProfileResponse,
  UpdateProfilePayload,
} from "@/data/types/profile";
import { getSessionUser } from "../../database/sessions";
import { updateUserProfile } from "../../database/users";
import { requestSessionId, sessionCookie } from "../auth/utils";

const updatePayloadSchema = profileSchema.and(
  z.object({ avatarUrl: z.string().nullable() }),
);

export const updateProfileHandler: HttpResponseResolver<
  never,
  UpdateProfilePayload,
  ProfileResponse | ProfileApiError | AuthApiError
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
      return HttpResponse.json<ProfileApiError>(
        { message: "Envie os dados em JSON válido." },
        { status: 400 },
      );
    }

    const result = updatePayloadSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      const errors: ProfileApiError["errors"] = {};
      for (const field of Object.keys(
        fieldErrors,
      ) as (keyof ProfileFormValues)[]) {
        const message = fieldErrors[field]?.[0];
        if (message) errors[field] = message;
      }
      return HttpResponse.json<ProfileApiError>(
        { message: "Confira os dados do perfil.", errors },
        { status: 422 },
      );
    }

    const updated = await updateUserProfile(sessionUser.id, result.data);
    if (!updated) {
      return HttpResponse.json<ProfileApiError>(
        { message: "Perfil não encontrado." },
        { status: 404 },
      );
    }

    if ("invalidPassword" in updated) {
      const message = "Senha atual incorreta.";
      return HttpResponse.json<ProfileApiError>(
        { message, errors: { currentPassword: message } },
        { status: 422 },
      );
    }

    if ("conflict" in updated) {
      const field = updated.conflict;
      const message =
        field === "email"
          ? "Este e-mail já está em uso."
          : "Este nome de usuário já está em uso.";
      return HttpResponse.json<ProfileApiError>(
        { message, errors: { [field]: message } },
        { status: 409 },
      );
    }

    return HttpResponse.json<ProfileResponse>({ profile: updated.profile });
  } catch {
    return HttpResponse.json<ProfileApiError>(
      { message: "Não foi possível salvar o perfil. Tente novamente." },
      { status: 503 },
    );
  }
};
