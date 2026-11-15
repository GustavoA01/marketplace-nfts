import { expect, test } from "@playwright/test";
import {
  controlRealtime,
  expectConnected,
  startPendingOrder,
} from "../helpers/realtime";
import { readCart } from "../helpers/mocks";

test.use({ viewport: { width: 390, height: 844 } });

for (const outcome of ["confirmed", "declined"] as const) {
  test(`pedido mobile ${outcome} permanece terminal após evento antigo`, async ({
    page,
  }) => {
    const { attempt } = await startPendingOrder(page);

    await controlRealtime(page, { action: "settle-order", attempt, outcome });

    const heading = page.getByRole("heading", {
      name:
        outcome === "confirmed"
          ? "Seus NFTs agora estão na sua carteira"
          : "Pagamento recusado",
    });
    await expect(heading).toBeVisible();

    await controlRealtime(page, { action: "replay-order" });
    await controlRealtime(page, { action: "replay-order", outdated: true });

    await expect(heading).toBeVisible();
    expect((await readCart(page)).items.length).toBe(
      outcome === "confirmed" ? 0 : 1,
    );
  });
}

test("pedido mobile retoma após interrupção e refresh com um único envio", async ({
  page,
}) => {
  let submissions = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/api/orders"
    )
      submissions += 1;
  });
  const { attempt } = await startPendingOrder(page);

  await controlRealtime(page, { action: "disconnect", milliseconds: 2000 });
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
  expect(submissions).toBe(1);
});
