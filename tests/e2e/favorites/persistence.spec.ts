import { expect, test } from "@playwright/test";
import { completeLogin, loginAtNFT, logout } from "../helpers/auth";
import { favoriteButton } from "../helpers/favorites";
import { viewports } from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Favoritos ${viewport.name}`, () => {
    test.use({ viewport });

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
  });
}
