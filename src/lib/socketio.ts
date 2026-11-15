import { io, type Socket } from "socket.io-client";
import type { ClientEvents, ServerEvents } from "@/data/schemas/realtime";

const mocks = import.meta.env.VITE_ENABLE_MOCKS === "true";
const url = mocks ? undefined : import.meta.env.VITE_SOCKET_URL || undefined;

export const socket: Socket<ServerEvents, ClientEvents> = io(url, {
  autoConnect: false,
  transports: ["websocket"],
  reconnectionDelay: 500,
  reconnectionDelayMax: 2000,
  randomizationFactor: mocks ? 0 : 0.5,
});
