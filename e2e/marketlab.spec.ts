import { expect, test } from "@playwright/test";

test("renders the MarketLab workspace", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /trade the workshop outcome/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /marketlab/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /open market/i }).first(),
  ).toBeVisible();
});

test.describe("authenticated Supabase workflow", () => {
  test.skip(
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "Requires a configured hosted Supabase workshop project.",
  );

  test("signs up, creates a market, trades, resolves, and opens portfolio", async ({
    page,
  }) => {
    const id = Date.now();
    const email = `workshop-${id}@example.com`;
    const marketTitle = `Will MarketLab e2e ${id} finish cleanly?`;

    await page.goto("/");
    await page.getByLabel("Display name").fill("E2E Trader");
    await page.getByLabel("Email").nth(1).fill(email);
    await page.getByLabel("Password").nth(1).fill("password123");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText(/account created/i)).toBeVisible();

    await page.getByLabel("Question").fill(marketTitle);
    await page
      .getByLabel("Description")
      .fill("Resolves YES when the Playwright smoke path reaches portfolio.");
    await page.getByLabel("Category").fill("E2E");
    await page
      .getByLabel("Close date")
      .fill(new Date(Date.now() + 86400000).toISOString().slice(0, 16));

    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lJY5WQAAAABJRU5ErkJggg==",
      "base64",
    );
    await page.getByLabel("Market image").setInputFiles({
      buffer: png,
      mimeType: "image/png",
      name: "market.png",
    });
    await page.getByRole("button", { name: "Create market" }).click();
    await expect(
      page.getByRole("heading", { name: marketTitle }),
    ).toBeVisible();

    await page.getByPlaceholder("25.00").first().fill("10");
    await page.getByRole("button", { name: "Buy YES" }).click();
    await expect(page.getByText(/bought yes/i)).toBeVisible();

    await page.getByRole("button", { name: "Resolve YES" }).click();
    await expect(page.getByText(/market resolved yes/i)).toBeVisible();
    await page.getByRole("button", { name: "Claim winnings" }).click();
    await expect(page.getByText(/winnings claimed/i)).toBeVisible();

    await page.getByRole("link", { name: /\$/ }).click();
    await expect(
      page.getByRole("heading", { name: "Portfolio" }),
    ).toBeVisible();
  });
});
