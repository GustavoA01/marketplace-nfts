import { expect, type Page } from "@playwright/test";

export const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
] as const;

export const setScenario = async (
  page: Page,
  resource: string,
  value?: string,
) => {
  await page.evaluate(
    ({ resource, value }) => {
      const key = `marketplace-nfts:${resource}-scenario`;

      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    },
    { resource, value },
  );
};

export const startWithScenario = async (
  page: Page,
  path: string,
  resource: string,
  value: string,
) => {
  await page.addInitScript(
    ({ resource, value }) => {
      localStorage.setItem(`marketplace-nfts:${resource}-scenario`, value);
    },
    { resource, value },
  );

  await page.goto(path);
};

export const addItem = async (
  page: Page,
  quantity = 1,
  edition = "1/50",
  nftId = "emerald-ape-042",
) => {
  await page.evaluate(
    async (item) => {
      const url = "/src/services/cart/add.ts";
      const { addCartItem } = await import(url);

      await addCartItem(item);
    },
    { nftId, quantity, edition },
  );
};

export const readCart = (page: Page) =>
  page.evaluate(async () => {
    const url = "/src/services/cart/get.ts";
    const { getCart } = await import(url);

    return getCart();
  });

export const openNFT = async (page: Page) => {
  await page.goto("/nfts/emerald-ape-042");

  await expect(
    page.getByRole("button", { name: /^(COMPRAR|Comprar NFT)$/ }),
  ).toBeVisible();
};

export const cartLine = (page: Page) =>
  page.locator("main article").filter({ hasText: "Edição:" }).first();

export const visibleText = (page: Page, text: string) =>
  page.getByText(text, { exact: true }).filter({ visible: true }).first();

export const seedAccountCart = async (page: Page) => {
  await page.evaluate(async () => {
    const load = (url: string) => import(url);
    const [{ loginUser }, { logoutUser }, { addCartItem }] = await Promise.all([
      load("/src/services/auth/login.ts"),
      load("/src/services/auth/logout.ts"),
      load("/src/services/cart/add.ts"),
    ]);

    await loginUser({
      email: "luna@example.com",
      password: "Colecionador123!",
    });

    try {
      await addCartItem({
        nftId: "emerald-ape-042",
        edition: "1/50",
        quantity: 1,
      });
    } finally {
      await logoutUser();
    }
  });
};
