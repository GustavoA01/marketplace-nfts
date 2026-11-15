import { expect, test } from "@playwright/test";
import { loginAtNFT } from "./helpers/auth";
import { seedCheckout } from "./helpers/checkout";

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test.describe(`Carteiras no pagamento ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });
    test("troca carteira, exige nova conexão e revisão e conclui o pedido", async ({
      page,
    }) => {
      test.setTimeout(60_000);
      await loginAtNFT(page);
      const secondaryId = await seedCheckout(page);
      await page.goto("/pagamento");
      await page
        .getByRole("button", { name: "Conectar carteira", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: "Desconectar carteira", exact: true }),
      ).toBeVisible();
      if (viewport.name === "mobile")
        await page
          .getByRole("button", { name: "Dados do colecionador e revisão" })
          .click();
      const review = page.getByRole("checkbox", {
        name: "Revisei os itens, a carteira e o total desta compra.",
      });
      await review.check();
      const confirm = page.getByRole("button", {
        name: "Confirmar compra",
        exact: true,
      });
      await expect(confirm).toBeEnabled();
      await page
        .getByRole("checkbox", { name: "Usar outra carteira?" })
        .check();
      await page
        .getByRole("radio", { name: /Carteira secundária de teste/ })
        .check();
      if (viewport.name === "mobile")
        await expect(
          page.locator(`#checkout-saved-${secondaryId}`),
        ).toBeChecked();
      await expect(review).not.toBeChecked();
      await expect(confirm).toBeDisabled();
      await page
        .getByRole("button", { name: "Conectar carteira", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: "Desconectar carteira", exact: true }),
      ).toBeVisible();
      await review.check();
      await expect(confirm).toBeEnabled();
      await confirm.click();
      await expect(
        page.getByRole("heading", {
          name: "Seus NFTs agora estão na sua carteira",
        }),
      ).toBeVisible();
      await expect(
        page.getByText("Carteira secundária de teste", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Ver no Etherscan", exact: true }),
      ).toHaveAttribute("href", /^https:\/\/etherscan\.io\/tx\/0x/);
      await page.goto("/carrinho");
      await expect(
        page.getByRole("heading", { name: "Seu carrinho está vazio" }),
      ).toBeVisible();
    });
  });
}

test.describe("Compatibilidade de rede", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("omite carteira de outra rede no seletor do formulário", async ({
    page,
  }) => {
    await loginAtNFT(page);
    await seedCheckout(page, "polygon");
    await page.goto("/pagamento");
    await page
      .getByRole("button", { name: "Dados do colecionador e revisão" })
      .click();
    await page.getByRole("checkbox", { name: "Usar outra carteira?" }).check();
    await expect(
      page.getByRole("radio", { name: /Carteira principal/ }),
    ).toBeChecked();
    await expect(
      page.getByRole("radio", { name: /Carteira secundária de teste/ }),
    ).not.toBeVisible();
  });

  test("recusa cotação e pedido incompatíveis na API e bloqueia carrinho com redes diferentes", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await loginAtNFT(page);
    const walletId = await seedCheckout(page, "polygon");
    const result = await page.evaluate(async (walletId) => {
      const load = (url: string) => import(url);
      const [
        { getCart },
        { createQuote },
        { cartSignature },
        orders,
        { addCartItem },
      ] = await Promise.all([
        load("/src/services/cart/get.ts"),
        load("/src/services/quotes/create.ts"),
        load("/src/lib/cart.ts"),
        load("/src/services/orders/index.ts"),
        load("/src/services/cart/add.ts"),
      ]);
      const cart = await getCart();
      const statusOf = async (action: () => Promise<unknown>) => {
        try {
          await action();
          return undefined;
        } catch (error) {
          return (error as { response?: { status: number } }).response?.status;
        }
      };
      const quoteRejected = await statusOf(() =>
        createQuote({ cartSignature: cartSignature(cart), network: "polygon" }),
      );
      const quote = await createQuote({
        cartSignature: cartSignature(cart),
        network: "ethereum",
      });
      const connection = await orders.connectWallet(walletId);
      const orderRejected = await statusOf(() =>
        orders.submitOrder(crypto.randomUUID(), {
          quoteId: quote.id,
          connectionId: connection.id,
          collector: {
            displayName: "Luna",
            username: "luna",
            profileName: "luna",
            email: "luna@example.com",
            note: "",
          },
        }),
      );
      await addCartItem({
        nftId: "sage-nomad-009",
        edition: "1/25",
        quantity: 1,
      });
      const mixed = await getCart();
      const mixedRejected = await statusOf(() =>
        createQuote({ cartSignature: cartSignature(mixed) }),
      );
      return { quoteRejected, orderRejected, mixedRejected };
    }, walletId);
    expect(result).toEqual({
      quoteRejected: 409,
      orderRejected: 409,
      mixedRejected: 409,
    });
    await page.goto("/carrinho");
    await expect(
      page.getByText(
        "Finalize uma rede por vez. Mantenha no carrinho apenas NFTs de uma mesma rede.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Conectar e finalizar", exact: true }),
    ).toBeDisabled();
    await page.goto("/pagamento");
    await expect(
      page.getByRole("button", { name: "Revisar carrinho", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Confirmar compra", exact: true }),
    ).not.toBeVisible();
  });
});
