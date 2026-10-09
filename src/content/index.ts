import { observeUrlChange } from "@/content/util/url-change-event"
import { parseRepository, type Repository } from "@/schema/repository"
import { initializeApp, cleanApp, isAppMounted } from "./initialize-app"

let currentRepo: Repository | undefined
let hasLoggedNotFound = false
let isMountScheduled = false

const ensureMounted = () => {
  isMountScheduled = false
  if (currentRepo === undefined || isAppMounted()) return

  if (!initializeApp(currentRepo) && !hasLoggedNotFound) {
    hasLoggedNotFound = true
    console.debug("[github-actions-search] sidebar not found")
  }
}

// SPA 版の GitHub は sidebar の描画が遅れたり、再描画で注入した要素ごと
// 差し替えたりするため、DOM の変化を監視して未 mount なら mount し直す
const scheduleEnsureMounted = () => {
  if (isMountScheduled) return

  isMountScheduled = true
  window.requestAnimationFrame(ensureMounted)
}

const initializeActionsSearch = () => {
  currentRepo = parseRepository(window.location.href)
  hasLoggedNotFound = false

  if (currentRepo === undefined) {
    cleanApp()
    return
  }

  if (!initializeApp(currentRepo)) {
    scheduleEnsureMounted()
  }
}

observeUrlChange()
initializeActionsSearch()

window.addEventListener("urlChange", initializeActionsSearch)
new MutationObserver(scheduleEnsureMounted).observe(document.body, {
  childList: true,
  subtree: true,
})
