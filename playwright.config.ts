import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const localChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests",
  testIgnore: ["**/._*"],
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: "list",
  use: {
    baseURL,
    viewport: { width: 1440, height: 1000 },
    launchOptions: existsSync(localChrome) ? { executablePath: localChrome } : {},
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "npm run dev -- --webpack --hostname 127.0.0.1",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
