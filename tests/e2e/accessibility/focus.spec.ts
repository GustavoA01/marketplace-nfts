import { expect, test } from "@playwright/test";
import { waitForCatalogue } from "../helpers/catalogue";
import { addItem, cartLine, openNFT } from "../helpers/mocks";

test("modal de login contém foco e devolve ao botão após Escape", async ({
  page,
}) => {
  await page.goto("/");
  await waitForCatalogue(page);
  const trigger = page
    .locator("header")
    .getByRole("button", { name: "Entrar", exact: true });

  await trigger.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 14; index += 1) {
    await page.keyboard.press(index < 7 ? "Tab" : "Shift+Tab");

    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }

  await page.keyboard.press("Escape");

  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("filtros mobile permitem teclado e restauram foco", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await waitForCatalogue(page);
  const trigger = page.getByRole("button", { name: "Filtros", exact: true });

  await trigger.focus();
  await page.keyboard.press("Enter");
  const option = page
    .getByRole("dialog")
    .getByRole("button", { name: /^Colecionáveis/ });
  await option.focus();
  await page.keyboard.press("Space");

  await expect(option).toHaveAttribute("aria-pressed", "true");
  expect(new URL(page.url()).searchParams.get("category")).toContain(
    "Colecionáveis",
  );

  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("cadastro associa erro ao campo e foca o primeiro inválido", async ({
  page,
}) => {
  await page.goto("/cadastro");
  const username = page.getByLabel("Nome de usuário", { exact: true });

  await username.fill("ab");
  await page.getByLabel("E-mail", { exact: true }).fill("teclado@example.com");
  await page.getByLabel("Senha", { exact: true }).fill("Colecionador123!");
  await page
    .getByLabel("Confirmar senha", { exact: true })
    .fill("Colecionador123!");
  await page
    .locator("form")
    .getByRole("button", { name: /Criar (conta|perfil)/ })
    .focus();
  await page.keyboard.press("Enter");

  await expect(username).toBeFocused();
  await expect(username).toHaveAttribute("aria-invalid", "true");
  const description = await username.getAttribute("aria-describedby");
  expect(description).toBeTruthy();
  await expect(page.locator(`[id="${description}"]`)).toContainText(
    "pelo menos 3 caracteres",
  );
});

test("quantidade e remoção do carrinho funcionam por teclado", async ({
  page,
}) => {
  await openNFT(page);
  await addItem(page);
  await page.goto("/carrinho");
  const increase = cartLine(page).getByRole("button", {
    name: "Aumentar quantidade",
  });

  await increase.focus();
  await page.keyboard.press("Space");

  await expect(
    cartLine(page)
      .getByText("2.38 ETH", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();

  const remove = cartLine(page).getByRole("button", {
    name: /Remover Emerald/,
  });

  await expect(remove).toBeEnabled();
  await remove.focus();
  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", { name: "Seu carrinho está vazio" }),
  ).toBeVisible();
});
