import path from "node:path"
import { test as base, chromium, type BrowserContext } from "@playwright/test"

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  // eslint-disable-next-line no-empty-pattern -- playwright が要求する書き方
  context: async ({}, use) => {
    const pathToExtension = path.join(import.meta.dirname, "..", "dist")
    console.log("pathToExtension", pathToExtension)
    const context = await chromium.launchPersistentContext(
      path.join(import.meta.dirname, "user_data"),
      {
        headless: true,
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
    const extensionId = background.url().split("/")[2]
    await use(extensionId)
  },
})

export const expect = test.expect
