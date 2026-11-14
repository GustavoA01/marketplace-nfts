import { http } from "msw/http";
import type { AuthApiError } from "@/data/types/auth";
import type {
  CreateWalletPayload,
  UpdateWalletPayload,
  WalletApiError,
  WalletResponse,
  WalletsResponse,
} from "@/data/types/wallets";
import { createWalletHandler } from "./create";
import { listWalletsHandler } from "./list";
import { updateWalletHandler } from "./update";

const walletsPrefix = "/api/wallets";

export const walletsHandlers = [
  http.get<never, never, WalletsResponse | AuthApiError>(
    walletsPrefix,
    listWalletsHandler,
  ),
  http.post<
    never,
    CreateWalletPayload,
    WalletResponse | WalletApiError | AuthApiError
  >(walletsPrefix, createWalletHandler),
  http.patch<
    { id: string },
    UpdateWalletPayload,
    WalletResponse | WalletApiError | AuthApiError
  >(`${walletsPrefix}/:id`, updateWalletHandler),
];
