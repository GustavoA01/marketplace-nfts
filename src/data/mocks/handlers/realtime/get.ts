import { HttpResponse, type HttpResponseResolver } from "msw/http";
import { countClients } from "../../realtime/clients";
import { cartUser } from "../cart/utils";

export const getRealtimeHandler: HttpResponseResolver = ({ request }) => {
  const user = cartUser(request);
  if (user instanceof Response) return user;
  return HttpResponse.json({ connections: countClients(user.userId) });
};
