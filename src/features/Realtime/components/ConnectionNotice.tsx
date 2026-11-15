import type { RealtimeStatus } from "../utils/status";

export const ConnectionNotice = ({ status }: { status: RealtimeStatus }) =>
  status === "disconnected" ? (
    <p role="status" className="text-sm text-text-secondary">
      Conexão interrompida. Tentando reconectar para atualizar seu pedido.
    </p>
  ) : null;
