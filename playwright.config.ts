import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    actionTimeout: 15000,
    navigationTimeout: 30000
  },
  timeout: 60000,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
