import path from "node:path"
import { test as base, chromium, type BrowserContext } from "@playwright/test"

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  // oxlint-disable-next-line no-empty-pattern -- playwright が要求する書き方
  context: async ({}, use) => {
    const pathToExtension = path.join(import.meta.dirname, "..", "dist")
    const context = await chromium.launchPersistentContext(
      path.join(import.meta.dirname, "user_data"),
      {
        headless: true,
        channel: "chromium",
        args: [
          `--disable-extensions-except=${pathToExtension}`,
          `--load-extension=${pathToExtension}`,
        ],
      }
    )
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    const [background] = context.serviceWorkers()
    if (!background) {
      throw new Error("Extension background service worker was not found")
    }

    const extensionId = new URL(background.url()).host
    if (!extensionId) {
      throw new Error("Extension ID was not found")
    }

    await use(extensionId)
  },
})

export const expect = test.expect
