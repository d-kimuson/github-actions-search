import { render } from "preact"
import type { Repository } from "../schema/repository"
import { App } from "./App"
import { findSidebarElement } from "./util/find-sidebar"

const rootId = "crx-root"

const getRepoKey = (repo: Repository) => `${repo.owner}/${repo.repo}`

export const { initializeApp, cleanApp, isAppMounted } = (() => {
  let rootElement: HTMLDivElement | null = null

  const unmount = () => {
    if (rootElement === null) return

    render(null, rootElement)
    rootElement.remove()
    rootElement = null
  }

  return {
    initializeApp: (repo: Repository): boolean => {
      const sidebarElement = findSidebarElement(document)

      if (!sidebarElement) return false

      // GitHub 側の再描画で sidebar ごと差し替えられた場合は古い root を破棄する
      if (rootElement !== null && !rootElement.isConnected) {
        unmount()
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

    cleanApp: unmount,

    isAppMounted: (): boolean => rootElement?.isConnected === true,
  }
})()
