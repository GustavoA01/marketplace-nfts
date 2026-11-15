import { expect, test } from "@playwright/test";
import { completeLogin } from "../helpers/auth";
import { preparePayment, controlRealtime } from "../helpers/realtime";
import { readCart, setScenario } from "../helpers/mocks";

test("recusa e desconexão da carteira bloqueiam envio até nova conexão", async ({
  page,
}) => {
  const { review, confirm } = await preparePayment(page);

  await page
    .getByRole("button", { name: "Desconectar carteira", exact: true })
    .click();

  await expect(confirm).toBeDisabled();
  await expect(review).not.toBeChecked();

  await setScenario(page, "payment", "wallet-refused");
  await page
    .getByRole("button", { name: "Conectar carteira", exact: true })
    .click();

  await expect(
    page.getByText("Conexão recusada pela carteira. Tente novamente.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(confirm).toBeDisabled();

  await setScenario(page, "payment");
  await page
    .getByRole("button", { name: "Conectar carteira", exact: true })
    .click();

  await expect(
    page.getByRole("button", { name: "Desconectar carteira", exact: true }),
  ).toBeVisible();

  await review.check();

  await expect(confirm).toBeEnabled();
});

test("sessão expirada no preenchimento preserva destino, carrinho e dados", async ({
  page,
}) => {
  await preparePayment(page);
  await page.locator("#checkout-displayName").fill("Nome durante checkout");

  await controlRealtime(page, { action: "expire-session" });

  await expect(page).toHaveURL(/\/login\?.*redirect=/);

  await completeLogin(page);

  await expect(page).toHaveURL(/\/pagamento/);
  await expect(page.locator("#checkout-displayName")).toHaveValue(
    "Nome durante checkout",
  );
  expect((await readCart(page)).items).toHaveLength(1);
});

test("cotação expirada é recusada e uma nova revisão libera a compra", async ({
  page,
}) => {
  await page.clock.install();
  const { review, confirm } = await preparePayment(page);
  const previous = await page.evaluate(async () => {
    const load = (url: string) => import(url);
    const [{ getCart }, { createQuote }, { cartSignature }, { connectWallet }] =
      await Promise.all([
        load("/src/services/cart/get.ts"),
        load("/src/services/quotes/create.ts"),
        load("/src/lib/cart.ts"),
        load("/src/services/orders/index.ts"),
      ]);
    const cart = await getCart();
    const quote = await createQuote({
      cartSignature: cartSignature(cart),
      network: "ethereum",
    });
    const connection = await connectWallet("wallet-luna-main");

    return { quoteId: quote.id, connectionId: connection.id };
  });

  await page.clock.fastForward(301_000);

  await expect(review).not.toBeChecked();
  await expect(confirm).toBeDisabled();
  const status = await page.evaluate(async (previous) => {
    const url = "/src/services/orders/index.ts";
    const { submitOrder } = await import(url);

    try {
      await submitOrder(crypto.randomUUID(), {
        ...previous,
        collector: {
          displayName: "Luna",
          username: "luna",
          profileName: "luna",
          email: "luna@example.com",
          note: "",
        },
      });
    } catch (error) {
      return (error as { response: { status: number } }).response.status;
    }
  }, previous);

  expect(status).toBe(409);

  await review.check();

  await expect(confirm).toBeEnabled();
});
