import React from "react"
import ReactDOM from "react-dom/client"
import type { Repository } from "../schema/repository"
import { App } from "./App"

export const { initializeApp, cleanApp } = (() => {
  let reactRoot: ReactDOM.Root | null = null

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

      const root = document.createElement("div")
      root.id = "crx-root"
      sidebarElement.prepend(root)

      reactRoot = ReactDOM.createRoot(root)
      reactRoot.render(
        <React.StrictMode>
          <App repo={repo} />
        </React.StrictMode>
      )

      return true
    },

    cleanApp: () => {
      if (reactRoot === null) return

      reactRoot.unmount()
      reactRoot = null
    },
  }
})()
