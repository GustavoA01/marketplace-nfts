import { expect, test } from "@playwright/test";
import {
  catalogueNames,
  searchNFTs,
  waitForCatalogue,
} from "../helpers/catalogue";
import { setScenario } from "../helpers/mocks";

test("busca vazia oferece retorno ao catálogo completo", async ({ page }) => {
  await page.goto("/");
  await waitForCatalogue(page);

  await searchNFTs(page, "nenhum-nft-com-este-nome");

  await expect(
    page.getByText("Nenhum NFT encontrado para esta busca.", { exact: true }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Ver todos os NFTs", exact: true })
    .click();

  await expect(page).not.toHaveURL(/q=/);
  await waitForCatalogue(page);
});

test("uma resposta antiga não substitui a busca mais recente", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await waitForCatalogue(page);
  await setScenario(page, "catalogue", "out-of-order");

  await searchNFTs(page, "ape");
  await expect(page).toHaveURL(/q=ape/);
  await searchNFTs(page, "Emerald Ape");
  await page.clock.fastForward(2000);

  await expect(page).toHaveURL(/q=Emerald/);
  await expect(catalogueNames(page)).toHaveText(["Emerald Ape #042"]);
  await expect(page.getByText("Busca:")).toContainText("Emerald");
});
