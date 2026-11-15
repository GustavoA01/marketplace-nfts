import type { Page } from "@playwright/test";

export const favoriteButton = (page: Page) =>
  page
    .locator("button:visible")
    .filter({ has: page.locator("svg.lucide-heart") })
    .first();
