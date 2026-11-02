import React from "react"
import ReactDOM from "react-dom/client"
import type { Repository } from "../schema/repository"
import { App } from "./App"

const mountRoot = (root: HTMLElement): boolean => {
  // React UI (2026-11): <aside aria-label="Actions"> > ... > <nav aria-label="Workflows">
  // (previously "Actions workflows")
  const aside = document.querySelector('aside[aria-label="Actions"]')
  const nav = aside?.querySelector(
    'nav[aria-label="Workflows"], nav[aria-label="Actions workflows"]'
  )
  if (aside && nav) {
    // Insert outside the scrollable list container so the dropdown isn't clipped
    let anchor: Element = nav
    while (anchor.parentElement && anchor.parentElement !== aside) {
      anchor = anchor.parentElement
    }
    root.style.padding = "8px 8px 0"
    aside.insertBefore(root, anchor)
    return true
  }

  // Legacy UI: <h2>Actions</h2> heading at the top of the sidebar pane
  const legacySidebar = Array.from(document.querySelectorAll("h2")).find(
    (elm) => elm.textContent?.trim() === "Actions"
  )?.parentElement?.parentElement
  if (legacySidebar) {
    legacySidebar.prepend(root)
    return true
  }

  return false
}

export const { initializeApp, cleanApp } = (() => {
  let reactRoot: ReactDOM.Root | null = null

  return {
    initializeApp: (repo: Repository): boolean => {
      const root = document.createElement("div")
      root.id = "crx-root"

      // On SPA navigation the previous root would otherwise leak and keep running
      const previous = document.getElementById("crx-root")
      if (!mountRoot(root)) {
        return false
      }
      reactRoot?.unmount()
      previous?.remove()

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
      document.getElementById("crx-root")?.remove()
    },
  }
})()
