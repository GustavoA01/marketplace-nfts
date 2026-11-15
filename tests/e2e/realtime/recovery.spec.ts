import { expect, test } from "@playwright/test";
import {
  controlRealtime,
  expectConnected,
  connectionCount,
  preparePayment,
  startPendingOrder,
} from "../helpers/realtime";

test("reconecta e recupera pedido concluído durante interrupção sem repetir compra", async ({
  page,
}) => {
  test.setTimeout(60_000);
  let submissions = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/api/orders"
    )
      submissions += 1;
  });
  const { attempt } = await startPendingOrder(page);

  await controlRealtime(page, { action: "disconnect", milliseconds: 1800 });

  await expect(
    page.getByText(
      "Conexão interrompida. Tentando reconectar para atualizar seu pedido.",
      { exact: true },
    ),
  ).toBeVisible();

  await controlRealtime(page, { action: "settle-order", attempt });

  await expectConnected(page);
  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
  expect(submissions).toBe(1);
});

test("recupera pedido após refresh sem reenviar a compra", async ({ page }) => {
  const { attempt } = await startPendingOrder(page);

  await page.reload();

  await expect(
    page.getByRole("heading", { name: "Pagamento pendente" }),
  ).toBeVisible();
  await expectConnected(page);

  await controlRealtime(page, { action: "settle-order", attempt });

  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
});

test("interrupção prolongada mostra um único toast e recupera a compra", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.clock.install();
  let submissions = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/api/orders"
    )
      submissions += 1;
  });
  const { confirm } = await preparePayment(page, "disconnect-order");
  const notice = page.getByText(
    "Conexão interrompida. Tentando reconectar automaticamente.",
    { exact: true },
  );

  await confirm.click();

  await expect(notice).toBeVisible();

  await page.clock.fastForward(4000);

  await expect.poll(() => connectionCount(page)).toBe(0);
  await expect(notice).toHaveCount(1);

  await page.clock.fastForward(3000);

  await expectConnected(page);
  await expect(notice).not.toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
  expect(submissions).toBe(1);
});
