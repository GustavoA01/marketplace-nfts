import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import type { AuthUser } from "@/data/types/auth";
import { queryKeys } from "@/data/query-keys";
import { useSession } from "@/features/Auth/hooks/useSession";
import { readAuthCookie } from "@/lib/auth-cookie";
import { socket } from "@/lib/socketio";
import { registerResourceEvents } from "../utils/resource-events";
import { reconcileResources } from "../utils/reconcile";
import { setRealtimeStatus, useRealtimeStatus } from "../utils/status";

const connectionToastId = "realtime-connection";

export const RealtimeSync = () => {
  const client = useQueryClient();
  const { data: user } = useSession();
  const ownerId = user?.id;
  const ready = user !== undefined;
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const status = useRealtimeStatus();

  useEffect(() => {
    if (!ready) return;
    let disposed = false;
    let established = false;
    let reconnecting = false;
    const sessionId = readAuthCookie();
    const active = () => {
      const current = client.getQueryData<AuthUser | null>(
        queryKeys.auth.session,
      );

      return !disposed && current !== undefined && current?.id === ownerId;
    };
    const removeResourceEvents = registerResourceEvents(
      client,
      ownerId,
      active,
    );

    const onConnect = () => {
      if (active()) socket.emit("session.authenticate", { sessionId });
    };

    const onReady = (session: { userId: string | null }) => {
      if (!active()) return;
      if ((session.userId ?? undefined) !== ownerId) {
        void client.invalidateQueries({ queryKey: queryKeys.auth.session });
        return;
      }

      established = true;
      reconnecting = false;
      toast.dismiss(connectionToastId);
      setRealtimeStatus("connected");
      void reconcileResources(client, ownerId, active);
    };

    const onDisconnect = () => {
      if (!active()) return;
      setRealtimeStatus("disconnected");
      if (!established || reconnecting) return;
      reconnecting = true;
      toast.warning(
        "Conexão interrompida. Tentando reconectar automaticamente.",
        {
          id: connectionToastId,
          duration: Infinity,
        },
      );
    };

    const onSessionExpired = () => {
      if (!active()) return;
      established = false;
      reconnecting = false;
      toast.dismiss(connectionToastId);
      setRealtimeStatus("disconnected");
      void client.invalidateQueries({ queryKey: queryKeys.auth.session });
    };

    socket.on("connect", onConnect);
    socket.on("session.ready", onReady);
    socket.on("session.expired", onSessionExpired);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onDisconnect);
    setRealtimeStatus("connecting");
    socket.connect();

    return () => {
      disposed = true;
      toast.dismiss(connectionToastId);
      removeResourceEvents();
      socket.off("connect", onConnect);
      socket.off("session.ready", onReady);
      socket.off("session.expired", onSessionExpired);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onDisconnect);
      socket.disconnect();
      setRealtimeStatus("disconnected");
    };
  }, [client, ownerId, ready]);

  useEffect(() => {
    if (status === "connected" && socket.connected)
      socket.emit("context.watch", { pathname });
  }, [pathname, status]);

  return null;
};
