import React from "react"
import ReactDOM from "react-dom/client"
import type { Repository } from "./App"
import { App } from "./App"

export const { initializeApp, cleanApp } = (() => {
  let reactRoot: ReactDOM.Root | null = null

  return {
    initializeApp: (repo: Repository): boolean => {
      const sidebarElement = Array.from(document.querySelectorAll("h2")).find(
        (elm) => elm.textContent === "Actions"
      )?.parentElement?.parentElement

      if (!sidebarElement) {
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
