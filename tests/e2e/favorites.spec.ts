import { expect, test, type Page } from "@playwright/test";
import { completeLogin, loginAtNFT, logout } from "./helpers/auth";

const favoriteButton = (page: Page) =>
  page
    .locator("button:visible")
    .filter({ has: page.locator("svg.lucide-heart") })
    .first();

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test.describe(`Favoritos ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("exige login, preserva o destino e persiste inclusão e remoção", async ({
      page,
    }) => {
      await page.goto("/nfts/emerald-ape-042");

      await favoriteButton(page).click();

      if (viewport.name === "desktop") {
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(page).toHaveURL(/\/nfts\/emerald-ape-042\/?$/);
      } else await expect(page).toHaveURL(/\/login\?.*redirect=/);

      await completeLogin(page);

      await expect(page).toHaveURL(/\/nfts\/emerald-ape-042\/?$/);
      await expect(page.getByRole("dialog")).not.toBeVisible();

      await favoriteButton(page).click();

      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await expect(favoriteButton(page)).toBeEnabled();

      await page.reload();

      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "true",
      );

      await page.goto("/favoritos");

      await expect(
        page.getByRole("heading", { name: "Emerald Ape #042", exact: true }),
      ).toBeVisible();

      await favoriteButton(page).click();

      await expect(
        page.getByText("Você ainda não tem NFTs favoritos."),
      ).toBeVisible();
      await expect(page).toHaveURL(/\/favoritos\/?$/);
      await expect(
        page.getByText("NFT removido dos favoritos.", { exact: true }),
      ).toBeVisible();

      await page.reload();

      await expect(
        page.getByText("Você ainda não tem NFTs favoritos."),
      ).toBeVisible();
    });

    test("reverte uma atualização otimista que falhou e permite tentar novamente", async ({
      page,
    }) => {
      await loginAtNFT(page);
      await expect(favoriteButton(page)).toBeEnabled();
      await page.evaluate(() =>
        localStorage.setItem(
          "marketplace-nfts:favorite-scenario",
          "slow-mutation-error",
        ),
      );

      await favoriteButton(page).click();

      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await expect(favoriteButton(page)).toBeDisabled();
      await expect(
        page.getByText(
          "Não foi possível atualizar os favoritos. Tente novamente.",
          { exact: true },
        ),
      ).toBeVisible();
      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "false",
      );
      await expect(favoriteButton(page)).toBeEnabled();

      await page.evaluate(() =>
        localStorage.removeItem("marketplace-nfts:favorite-scenario"),
      );
      await page
        .locator("[data-sonner-toast]")
        .filter({
          hasText: "Não foi possível atualizar os favoritos. Tente novamente.",
        })
        .getByRole("button", { name: "Close toast", exact: true })
        .click();

      await expect(
        page.getByText(
          "Não foi possível atualizar os favoritos. Tente novamente.",
          { exact: true },
        ),
      ).not.toBeVisible();

      await favoriteButton(page).click();

      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await expect(favoriteButton(page)).toBeEnabled();

      await page.reload();

      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    test("isola favoritos ao sair e trocar de usuário", async ({ page }) => {
      test.setTimeout(60_000);
      await loginAtNFT(page);

      await favoriteButton(page).click();

      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await expect(favoriteButton(page)).toBeEnabled();

      await logout(page);
      await loginAtNFT(page, "theo@example.com");

      await expect(favoriteButton(page)).toBeEnabled();
      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "false",
      );

      await page.goto("/favoritos");

      await expect(
        page.getByText("Você ainda não tem NFTs favoritos."),
      ).toBeVisible();

      await logout(page);
      await loginAtNFT(page);

      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    test("recupera a consulta após falha da API", async ({ page }) => {
      await loginAtNFT(page);
      await page.evaluate(() =>
        localStorage.setItem("marketplace-nfts:favorite-scenario", "error"),
      );

      await page.goto("/favoritos");

      await expect(
        page.getByText("Não foi possível carregar os favoritos.", {
          exact: true,
        }),
      ).toBeVisible();

      await page.evaluate(() =>
        localStorage.removeItem("marketplace-nfts:favorite-scenario"),
      );
      await page
        .getByRole("button", { name: "Tentar novamente", exact: true })
        .click();

      await expect(
        page.getByText("Você ainda não tem NFTs favoritos."),
      ).toBeVisible();
    });

    test("solicita autenticação se a sessão expirar durante a mutation", async ({
      page,
      context,
    }) => {
      await loginAtNFT(page);
      await expect(favoriteButton(page)).toBeEnabled();
      await context.clearCookies();

      await favoriteButton(page).click();

      if (viewport.name === "desktop")
        await expect(page.getByRole("dialog")).toBeVisible();
      else await expect(page).toHaveURL(/\/login\?.*redirect=/);

      await completeLogin(page);

      await expect(favoriteButton(page)).toBeEnabled();
      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "false",
      );

      await favoriteButton(page).click();

      await expect(favoriteButton(page)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await expect(favoriteButton(page)).toBeEnabled();
    });
  });
}
