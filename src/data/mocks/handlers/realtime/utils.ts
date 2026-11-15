import { HttpResponse } from "msw/http";

export const unauthorizedRealtime = () =>
  HttpResponse.json({ message: "Entre para continuar." }, { status: 401 });

export const requireRealtimeUserId = (userId?: string) => {
  if (!userId) return unauthorizedRealtime();
  return { userId };
};

export const realtimeCommandError = () =>
  HttpResponse.json(
    { message: "Não foi possível executar o cenário." },
    { status: 503 },
  );
