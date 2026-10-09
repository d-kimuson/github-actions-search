import { beforeEach, describe, expect, it } from "vitest"
import { findSidebarElement } from "@/content/util/find-sidebar"

describe("findSidebarElement", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  it("workflow link を含む nav の親要素を返すこと", () => {
    document.body.innerHTML = `
      <div id="sidebar">
        <nav aria-label="Workflows">
          <ul>
            <li><a href="/owner/repo/actions/workflows/check.yaml">Check</a></li>
          </ul>
        </nav>
      </div>
      <main>
        <h4><a href="/owner/repo/actions/runs/1">run</a></h4>
      </main>
    `

    expect(findSidebarElement(document)?.id).toBe("sidebar")
  })

  it("Primer React 版の sidebar では workflow nav の親要素を返すこと", () => {
    document.body.innerHTML = `
      <aside aria-label="Actions">
        <div>
          <div id="sidebar" style="padding:0">
            <nav aria-label="Actions workflows" data-component="NavList">
              <ul>
                <li><a href="/owner/repo/actions">All workflows</a></li>
                <li>
                  <h3>Workflows</h3>
                  <ul>
                    <li><a href="/owner/repo/actions/workflows/check.yml">Check</a></li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div>
          <nav aria-label="Actions management">
            <a href="/owner/repo/actions/caches">Caches</a>
          </nav>
        </div>
      </aside>
    `

    expect(findSidebarElement(document)?.id).toBe("sidebar")
  })

  it("aria-label が変わっても workflow link を含む nav を見つけられること", () => {
    document.body.innerHTML = `
      <div id="sidebar">
        <nav aria-label="Some other label">
          <a href="/owner/repo/actions/workflows/check.yaml">Check</a>
        </nav>
      </div>
    `

    expect(findSidebarElement(document)?.id).toBe("sidebar")
  })

  it("nav 外の workflow link (run 一覧など) には反応しないこと", () => {
    document.body.innerHTML = `
      <main>
        <a href="/owner/repo/actions/workflows/check.yaml">Check</a>
      </main>
    `

    expect(findSidebarElement(document)).toBeUndefined()
  })

  it("該当要素が無い場合は undefined を返すこと", () => {
    expect(findSidebarElement(document)).toBeUndefined()
  })
})
