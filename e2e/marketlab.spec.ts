import { expect, test } from "@playwright/test";

test("renders the MarketLab starter", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "MarketLab is ready." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /marketlab/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  await expect(page.getByText(/cursor workshop \/ quito/i)).toBeVisible();
  await expect(page.getByText(/local setup is running/i)).toBeVisible();
});

test("renders the sign-in form", async ({ page }) => {
  await page.goto("/auth");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Create account" }),
  ).toBeVisible();
});

test("renders the sign-up form", async ({ page }) => {
  await page.goto("/auth?mode=signup");

  await expect(
    page.getByRole("heading", { name: "Create account" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "Sign in" }),
  ).toBeVisible();
});
