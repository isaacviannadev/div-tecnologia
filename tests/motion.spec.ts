import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Browser automation must never capture the user's pointer or send real mail.
  await page.addInitScript(() => {
    Element.prototype.requestPointerLock = async () => {};
    Element.prototype.setPointerCapture = () => {};
  });
  await page.route("**/api/mail", (route) => route.abort());
});

async function progress(page: Page, selector: string, property: string) {
  return page.locator(selector).evaluate(
    (element, name) => Number.parseFloat(getComputedStyle(element).getPropertyValue(name)),
    property,
  );
}

async function noHorizontalOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.scrollWidth - window.innerWidth,
  )).toBeLessThanOrEqual(1);
}

async function fillContact(page: Page) {
  await page.locator("#ct-name").fill("Motion Test");
  await page.locator("#ct-email").fill("motion@example.com");
  await page.locator("#ct-more").fill("Browser test. This request is intercepted locally.");
}

async function holdMail(page: Page, status: number) {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const payloads: unknown[] = [];
  await page.route("**/api/mail", async (route) => {
    payloads.push(route.request().postDataJSON());
    await gate;
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ ok: status === 200 }) });
  });
  return { release, payloads };
}

test("native scroll advances the hero and delivery timeline in both directions", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero-title")).toBeVisible();
  await expect.poll(() => progress(page, "[data-hero-scene]", "--hero-progress")).toBe(0);
  const opening = await page.locator(".hero-blueprint-mark").evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: "instant" }));
  await expect.poll(() => progress(page, "[data-hero-scene]", "--hero-progress")).toBeGreaterThan(.1);
  await expect.poll(() => page.locator(".hero-blueprint-mark").evaluate((el) => getComputedStyle(el).transform)).not.toBe(opening);

  await page.locator("#process").evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + el.clientHeight - window.innerHeight * .5, behavior: "instant" }));
  await expect.poll(() => progress(page, "#process", "--process-progress")).toBe(1);
  await expect(page.locator("#process .step[data-active=true]")).toHaveCount(4);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => progress(page, "[data-hero-scene]", "--hero-progress")).toBe(0);
  await noHorizontalOverflow(page);
});

test("live reduced-motion changes reveal all content and stop depth transforms", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => page.locator(".motion-pending").count()).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".motion-pending")).toHaveCount(0);
  await expect(page.locator(".hero-blueprint-mark")).toHaveCSS("transform", "none");
  await expect(page.locator(".depth-panel")).toHaveCSS("transform", "none");
  await expect(page.locator("#process .step[data-active=true]")).toHaveCount(4);
  await expect(page.locator(".process-heading")).toHaveCSS("position", "static");
  for (const reveal of await page.locator(".reveal").all()) {
    await expect(reveal).toHaveCSS("opacity", "1");
  }
});

test("compact phone layout and menu remain usable through navigation", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/");
  await noHorizontalOverflow(page);
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await page.locator(".nav-panel").getByRole("link", { name: "Serviços", exact: true }).click();
  await expect(page).toHaveURL(/\/servicos$/);
  await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");
  await page.locator(".svc-row").last().scrollIntoViewIfNeeded();
  await expect(page.locator(".svc-row").last()).toHaveCSS("opacity", "1");
  await noHorizontalOverflow(page);
});

test("language, theme, and client navigation preserve readable content", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.locator(".nav-inner").getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toContainText("readable by");
  await page.locator(".nav-inner").getByRole("button", { name: "Ativar tema claro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "light");
  await page.locator(".nav-links").getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/sobre$/);
  await expect(page.locator("h1")).toBeVisible();
  for (const reveal of await page.locator(".reveal").all()) {
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveCSS("opacity", "1");
  }
  await noHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test("contact ASCII pending state stays readable and resolves after success", async ({ page }) => {
  const mail = await holdMail(page, 200);
  await page.goto("/contato");
  await fillContact(page);
  const submit = page.getByRole("button", { name: "Enviar mensagem", exact: true });
  const initialWidth = (await submit.boundingBox())!.width;
  await submit.click();
  const sending = page.getByRole("button", { name: "Enviando…", exact: true });
  await expect(sending).toBeDisabled();
  await expect(sending.locator("[data-ascii-skeleton]")).toBeVisible();
  await expect(sending.locator(".ascii-submit-label > span").last()).toBeVisible();
  expect((await sending.boundingBox())!.width).toBeCloseTo(initialWidth, 0);
  expect(mail.payloads).toEqual([expect.objectContaining({ template: "contact", email: "motion@example.com" })]);
  mail.release();
  await expect(submit).toBeEnabled();
  await expect(page.locator("#ct-name")).toHaveValue("");
  await expect(page.locator("[data-sonner-toast][data-type=success]")).toBeVisible();
  await expect(page.locator(".ascii-submit [data-ascii-skeleton]")).toHaveCount(0);
});

test("reduced-motion contact errors restore the action and preserve entered data", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const mail = await holdMail(page, 500);
  await page.goto("/contato");
  await fillContact(page);
  await page.getByRole("button", { name: "Enviar mensagem", exact: true }).click();
  const sending = page.getByRole("button", { name: "Enviando…", exact: true });
  await expect(sending).toBeDisabled();
  await expect(sending.locator("[data-ascii-skeleton]")).toBeVisible();
  await expect(sending.locator(".ascii-submit-label > span").last()).toBeVisible();
  mail.release();
  await expect(page.getByRole("button", { name: "Enviar mensagem", exact: true })).toBeEnabled();
  await expect(page.locator("#ct-name")).toHaveValue("Motion Test");
  await expect(page.locator("[data-sonner-toast][data-type=error]")).toContainText("Tente novamente");
});

test("English newsletter shows visible ASCII feedback with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const mail = await holdMail(page, 200);
  await page.goto("/");
  await page.locator(".nav-inner").getByRole("button", { name: "EN", exact: true }).click();
  await page.locator(".news input").fill("newsletter@example.com");
  await page.getByRole("button", { name: "Subscribe to newsletter" }).click();
  await expect(page.getByRole("button", { name: "Sending…", exact: true })).toBeDisabled();
  await expect(page.locator(".news [data-ascii-skeleton]")).toBeVisible();
  await expect(page.locator(".ascii-submit-status")).toHaveText("Sending…");
  await expect(page.locator(".ascii-submit-status")).toBeVisible();
  expect(mail.payloads).toEqual([{ template: "newsletter", email: "newsletter@example.com" }]);
  mail.release();
  await expect(page.getByRole("button", { name: "Subscribe to newsletter" })).toBeEnabled();
  await expect(page.locator(".news input")).toHaveValue("");
  await expect(page.locator("[data-sonner-toast][data-type=success]")).toContainText("Subscription sent!");
});

test("ASCII navigation feedback appears only while a route is pending", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route(/\/servicos\?.*_rsc=/, async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/");
  const link = page.locator(".nav-links").getByRole("link", { name: "Serviços", exact: true });
  try {
    await link.click();
    await expect(link.locator(".ascii-link-pending [data-ascii-skeleton]")).toBeVisible();
    await expect(page.locator(".hero-title")).toBeVisible();
  } finally {
    release();
  }
  await expect(page).toHaveURL(/\/servicos$/);
  await expect(page.locator(".ascii-link-pending")).toHaveCount(0);
});

test("server-rendered content remains readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto(baseURL!);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".hero-foot")).toHaveCSS("opacity", "1");
    await expect(page.locator("#process .step")).toHaveCount(4);
    await expect(page.locator(".motion-pending")).toHaveCount(0);
    await noHorizontalOverflow(page);
  } finally {
    await context.close();
  }
});
