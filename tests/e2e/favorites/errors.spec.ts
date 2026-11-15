import { expect, test } from "@playwright/test";
import { completeLogin, loginAtNFT } from "../helpers/auth";
import { favoriteButton } from "../helpers/favorites";
import { viewports } from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Favoritos ${viewport.name}`, () => {
    test.use({ viewport });

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
