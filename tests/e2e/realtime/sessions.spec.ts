import { expect, test } from "@playwright/test";
import { completeLogin, logout } from "../helpers/auth";
import {
  captureEvents,
  controlRealtime,
  expectConnected,
  startPendingOrder,
} from "../helpers/realtime";

test("libera conexão anterior e não entrega pedido de outra conta", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.clock.install();
  const { attempt } = await startPendingOrder(page);

  await controlRealtime(page, {
    action: "settle-order",
    attempt,
    delay: 30_000,
  });
  await logout(page);
  await page.goto("/login?redirect=%2Fperfil");
  await completeLogin(page, "theo@example.com");
  await expectConnected(page);
  const received = await captureEvents(page);
  await page.clock.fastForward(31_000);

  await expect(page.getByLabel("Nome de usuário")).toHaveValue("theocollector");
  expect(await received.evaluate((events) => events.orders.length)).toBe(0);

  const status = await page.evaluate(async (attempt) => {
    const url = "/src/services/orders/index.ts";
    const { getOrder } = await import(url);

    try {
      await getOrder(attempt);
      return undefined;
    } catch (error) {
      return (error as { response?: { status: number } }).response?.status;
    }
  }, attempt);

  expect(status).toBe(404);

  await logout(page);
  await page.goto("/login?redirect=%2Fperfil");
  await completeLogin(page);
  const completed = await page.evaluate(async (attempt) => {
    const url = "/src/services/orders/index.ts";
    const { getOrder } = await import(url);

    return (await getOrder(attempt)).status;
  }, attempt);

  expect(completed).toBe("confirmed");
});

test("sessão expirada encerra assinatura privada e preserva destino do login", async ({
  page,
}) => {
  const { attempt } = await startPendingOrder(page);

  await controlRealtime(page, { action: "expire-session" });

  await expect(page).toHaveURL(/\/login\?.*redirect=/);

  await completeLogin(page);

  await expect(page).toHaveURL(new RegExp(`confirmacao-pedido.*${attempt}`));
  await expectConnected(page);
  await expect(
    page.getByRole("heading", { name: "Pagamento pendente" }),
  ).toBeVisible();
});
