import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Beyond Expertise/);
    await expect(page.locator(".home-hero-plb")).toBeVisible();
    await expect(page.locator(".home-hero-plb-title")).toBeVisible();
  });

  test("shows trust strip with key signals", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".home-trust-strip")).toBeVisible();
    await expect(page.getByText("4,8 / 5")).toBeVisible();
    await expect(page.locator(".home-trust-strip").getByText("Qualiopi")).toBeVisible();
    await expect(page.getByText("94 %").first()).toBeVisible();
  });

  test("shows client logos band", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".home-logos-band")).toBeVisible();
    await expect(page.getByText("BNP Paribas")).toBeVisible();
  });

  test("shows stats panel", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".home-stats-panel")).toBeVisible();
  });

  test("shows advantages panel", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".home-advantages-panel")).toBeVisible();
  });

  test("shows interest/CTA band", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".home-interest-band")).toBeVisible();
  });

  test("shows resources grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".home-resources-grid")).toBeVisible();
  });

  test("shows FAQ band", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".home-faq-band")).toBeVisible();
  });

  test("search form is functional", async ({ page }) => {
    await page.goto("/");
    await page.fill(".home-hero-plb-search-input", "Power BI");
    await page.locator(".home-hero-plb-search-button").click();
    await expect(page).toHaveURL(/formations.*q=Power/);
  });
});

test.describe("À propos page", () => {
  test("loads with hero and rich content", async ({ page }) => {
    await page.goto("/a-propos");
    await expect(page.locator(".about-hero")).toBeVisible();
    await expect(page.getByText("+8 000")).toBeVisible();
    await expect(page.locator(".about-numbers-panel")).toBeVisible();
    await expect(page.locator(".about-certs-band")).toBeVisible();
    await expect(page.getByText("Qualiopi").first()).toBeVisible();
    await expect(page.locator(".about-values-grid")).toBeVisible();
  });
});

test.describe("Entreprises page", () => {
  test("loads with hero and B2B content", async ({ page }) => {
    await page.goto("/entreprises");
    await expect(page.locator(".entreprises-hero")).toBeVisible();
    await expect(page.locator(".entreprises-use-cases")).toBeVisible();
    await expect(page.locator(".entreprises-funding")).toBeVisible();
    await expect(page.getByText("OPCO").first()).toBeVisible();
  });

  test("process steps are visible", async ({ page }) => {
    await page.goto("/entreprises");
    await expect(page.locator(".entreprises-process")).toBeVisible();
    await expect(page.getByText("01")).toBeVisible();
    await expect(page.getByText("04")).toBeVisible();
  });
});

test.describe("Méthodologie page", () => {
  test("loads with hero and steps", async ({ page }) => {
    await page.goto("/methodologie");
    await expect(page.locator(".methodo-hero")).toBeVisible();
    await expect(page.locator(".methodo-steps")).toBeVisible();
    await expect(page.getByText("Cadrer")).toBeVisible();
    await expect(page.getByText("Mesurer")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("header is visible on all pages", async ({ page }) => {
    for (const path of ["/", "/formations", "/a-propos", "/entreprises", "/contact"]) {
      await page.goto(path);
      await expect(page.locator(".site-header")).toBeVisible();
    }
  });

  test("footer shows Qualiopi badge", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.locator(".footer-trust-badge-success")).toBeVisible();
  });

  test("CTA buttons navigate correctly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Explorer le catalogue/ }).first().click();
    await expect(page).toHaveURL(/formations/);
  });
});
