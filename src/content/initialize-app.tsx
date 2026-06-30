import { render } from "preact"
import type { Repository } from "../schema/repository"
import { App } from "./App"

const rootId = "crx-root"

const getRepoKey = (repo: Repository) => `${repo.owner}/${repo.repo}`

export const { initializeApp, cleanApp } = (() => {
  let rootElement: HTMLDivElement | null = null

  return {
    initializeApp: (repo: Repository): boolean => {
      const sidebarElement = Array.from(
        document.querySelectorAll("h2, h3")
      ).find((elm) => elm.textContent?.trim() === "Actions")?.parentElement
        ?.parentElement

      if (!sidebarElement) {
        console.debug("[github-actions-search] sidebar not found")
        return false
      }

      const existingRoot = document.getElementById(rootId)
      rootElement =
        existingRoot instanceof HTMLDivElement
          ? existingRoot
          : document.createElement("div")
      rootElement.id = rootId

      if (!rootElement.isConnected) {
        sidebarElement.prepend(rootElement)
      }

      render(<App key={getRepoKey(repo)} repo={repo} />, rootElement)

      return true
    },

    cleanApp: () => {
      if (rootElement === null) return

      render(null, rootElement)
      rootElement.remove()
      rootElement = null
    },
  }
})()
