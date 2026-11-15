import { expect, type Page } from "@playwright/test";
import { loginAtNFT } from "./auth";
import { seedCheckout } from "./checkout";

export const controlRealtime = (page: Page, command: Record<string, unknown>) =>
  page.evaluate(async (command) => {
    const url = "/src/lib/http.ts";
    const { http } = await import(url);
    const { data } = await http.post("/mock/realtime", command);

    return data;
  }, command);

export const connectionCount = (page: Page) =>
  page.evaluate(async () => {
    const url = "/src/lib/http.ts";
    const { http } = await import(url);
    const { data } = await http.get("/mock/realtime");

    return data.connections as number;
  });

export const expectConnected = async (page: Page) => {
  await expect(page.locator("main")).toBeVisible();
  await expect.poll(() => connectionCount(page), { timeout: 10_000 }).toBe(1);
};

export const captureEvents = (page: Page) =>
  page.evaluateHandle(async () => {
    const url = "/src/lib/socketio.ts";
    const { socket } = await import(url);
    const events: {
      nfts: { nftId: string; version: number; price: string }[];
      orders: {
        orderId: string;
        userId: string;
        version: number;
        status: string;
      }[];
    } = { nfts: [], orders: [] };

    socket.on("nft.updated", (event: (typeof events.nfts)[number]) => {
      events.nfts.push(event);
    });
    socket.on("order.updated", (event: (typeof events.orders)[number]) => {
      events.orders.push(event);
    });

    return events;
  });

export const preparePayment = async (
  page: Page,
  scenario = "normal",
  mobile = false,
) => {
  await loginAtNFT(page);
  await seedCheckout(page);
  await page.goto(`/pagamento?scenario=${scenario}&trigger=manual`);
  await expectConnected(page);
  await page
    .getByRole("button", { name: "Conectar carteira", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Desconectar carteira", exact: true }),
  ).toBeVisible();

  if (mobile)
    await page
      .getByRole("button", { name: "Dados do colecionador e revisão" })
      .click();

  const review = page.getByRole("checkbox", {
    name: "Revisei os itens, a carteira e o total desta compra.",
  });
  const confirm = page.getByRole("button", {
    name: "Confirmar compra",
    exact: true,
  });

  await review.check();
  await expect(confirm).toBeEnabled();

  return { review, confirm };
};

export const startPendingOrder = async (page: Page) => {
  const { confirm } = await preparePayment(page, "pending");
  const events = await captureEvents(page);
  await confirm.click();
  await expect(
    page.getByRole("heading", { name: "Pagamento pendente" }),
  ).toBeVisible();
  const attempt = new URL(page.url()).searchParams.get("attempt");

  if (!attempt) throw new Error("Tentativa não encontrada.");

  return { attempt, events };
};
