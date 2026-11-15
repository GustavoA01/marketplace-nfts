import { expect, test } from "@playwright/test";
import { preparePayment, controlRealtime } from "../helpers/realtime";
import { addItem, readCart, setScenario } from "../helpers/mocks";

test("cliques repetidos criam um pedido e removem apenas a quantidade comprada", async ({
  page,
}) => {
  const { confirm } = await preparePayment(page, "pending");
  let submissions = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/api/orders"
    )
      submissions += 1;
  });

  await confirm.click({ clickCount: 2 });

  await expect(
    page.getByRole("heading", { name: "Pagamento pendente" }),
  ).toBeVisible();
  const attempt = new URL(page.url()).searchParams.get("attempt");
  await addItem(page, 2);

  await controlRealtime(page, { action: "settle-order", attempt });

  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
  expect(submissions).toBe(1);
  expect((await readCart(page)).totalQuantity).toBe(2);
});

test("timeout após criar recupera o mesmo pedido e rejeita chave com outro conteúdo", async ({
  page,
}) => {
  test.setTimeout(75_000);
  const { confirm } = await preparePayment(page);
  await setScenario(page, "payment", "timeout-after-create");
  const requests: string[] = [];
  let originalPayload: Record<string, unknown> = {};
  page.on("request", (request) => {
    if (
      request.method() !== "POST" ||
      new URL(request.url()).pathname !== "/api/orders"
    )
      return;
    requests.push(request.headers()["idempotency-key"]);
    if (requests.length === 1) originalPayload = request.postDataJSON();
  });

  await confirm.click();

  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible({ timeout: 25_000 });
  const attempt = new URL(page.url()).searchParams.get("attempt")!;
  expect(requests).toEqual([attempt]);
  expect((await readCart(page)).items).toHaveLength(0);

  await setScenario(page, "payment");
  const result = await page.evaluate(
    async ({ attempt, originalPayload }) => {
      const url = "/src/services/orders/index.ts";
      const { getOrder, submitOrder } = await import(url);
      const order = await getOrder(attempt);
      const replayed = await submitOrder(attempt, originalPayload);
      let conflict;

      try {
        await submitOrder(attempt, {
          quoteId: crypto.randomUUID(),
          connectionId: crypto.randomUUID(),
          collector: { ...order.collector, note: "Outro conteúdo" },
        });
      } catch (error) {
        conflict = (error as { response: { status: number } }).response.status;
      }

      return { id: order.id, replayedId: replayed.id, conflict };
    },
    { attempt, originalPayload },
  );

  expect(result.conflict).toBe(409);
  expect(result.replayedId).toBe(result.id);
  expect((await readCart(page)).items).toHaveLength(0);

  await page.reload();

  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
  const recoveredId = await page.evaluate(async (attempt) => {
    const url = "/src/services/orders/index.ts";
    const { getOrder } = await import(url);

    return (await getOrder(attempt)).id;
  }, attempt);

  expect(recoveredId).toBe(result.id);
  expect(requests).toEqual([attempt, attempt, attempt]);
});
