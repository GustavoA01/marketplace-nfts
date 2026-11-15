import { useSyncExternalStore } from "react";

export type RealtimeStatus = "connecting" | "connected" | "disconnected";

let status: RealtimeStatus = "connecting";
const listeners = new Set<() => void>();

export const setRealtimeStatus = (next: RealtimeStatus) => {
  if (status === next) return;
  status = next;

  for (const listener of Array.from(listeners)) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const useRealtimeStatus = () =>
  useSyncExternalStore<RealtimeStatus>(
    subscribe,
    () => status,
    () => "connecting",
  );
