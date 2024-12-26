import { test, expect } from "./fixture.js"

test("Visual Regression Testing", async ({ page }) => {
  await page.goto(
    "https://github.com/d-kimuson/github-actions-search/actions",
    {
      waitUntil: "networkidle",
    }
  )

  await expect(page).toHaveScreenshot("0_loaded.png", {
    threshold: 0.1,
  })

  await page
    .getByRole("button", {
      name: "ワークフローを検索",
    })
    .click()

  await expect(page).toHaveScreenshot("1_expanded.png", {
    threshold: 0.1,
  })

  await page
    .getByRole("textbox", {
      name: "検索キーワードを入力",
    })
    .fill("check")

  await expect(page).toHaveScreenshot("2_filtered.png", {
    threshold: 0.1,
  })
})
