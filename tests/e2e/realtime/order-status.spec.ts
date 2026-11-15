import { expect, test } from "@playwright/test";
import { controlRealtime, startPendingOrder } from "../helpers/realtime";

for (const outcome of ["confirmed", "declined"] as const) {
  test(`pedido ${outcome} recebe evento e preserva snapshot ou carrinho`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.clock.install();
    const { attempt, events } = await startPendingOrder(page);
    let consultations = 0;
    page.on("request", (request) => {
      if (
        request.method() === "GET" &&
        new URL(request.url()).pathname === "/api/orders"
      )
        consultations += 1;
    });

    await page.clock.fastForward(3000);

    expect(consultations).toBe(0);

    if (outcome === "confirmed")
      await controlRealtime(page, {
        action: "update-nft",
        nftId: "emerald-ape-042",
        price: "1.49",
      });

    await controlRealtime(page, { action: "settle-order", attempt, outcome });

    await expect
      .poll(() =>
        events.evaluate(
          (events) => events.orders[events.orders.length - 1]?.status,
        ),
      )
      .toBe(outcome);

    if (outcome === "confirmed") {
      await expect(
        page.getByRole("heading", {
          name: "Seus NFTs agora estão na sua carteira",
        }),
      ).toBeVisible();
      await expect(
        page.getByText("1.19 ETH", { exact: true }).first(),
      ).toBeVisible();

      await controlRealtime(page, { action: "replay-order", outdated: true });

      await expect
        .poll(() =>
          events.evaluate(
            (events) => events.orders[events.orders.length - 1]?.status,
          ),
        )
        .toBe("pending");
      await expect(
        page.getByRole("heading", {
          name: "Seus NFTs agora estão na sua carteira",
        }),
      ).toBeVisible();

      await page.goto("/carrinho");

      await expect(
        page.getByRole("heading", { name: "Seu carrinho está vazio" }),
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: "Pagamento recusado" }),
      ).toBeVisible();

      await page.goto("/carrinho");

      await expect(
        page.getByText("Emerald Ape #042", { exact: true }).first(),
      ).toBeVisible();
    }
  });
}
