import { test, expect } from "./fixture.js"

const defaultClip = {
  x: 0,
  y: 180,
  width: 350,
  height: 800,
} as const

test("Visual Regression Testing", async ({ page }) => {
  await page.goto(
    "https://github.com/d-kimuson/github-actions-search/actions",
    {
      waitUntil: "networkidle",
    }
  )

  const openButton = page.getByRole("button", {
    name: "ワークフローを検索",
  })

  await openButton.waitFor({
    state: "visible",
  })
  await expect(page).toHaveScreenshot("0_loaded.png", {
    threshold: 0.02,
    clip: defaultClip,
  })

  await openButton.click()
  const searchInput = page.getByRole("textbox", {
    name: "検索キーワードを入力",
  })
  await searchInput.waitFor({
    state: "visible",
  })
  await expect(page).toHaveScreenshot("1_expanded.png", {
    threshold: 0.02,
    clip: defaultClip,
  })

  await searchInput.fill("check")
  await expect(page).toHaveScreenshot("2_filtered.png", {
    threshold: 0.02,
    clip: defaultClip,
  })
})
