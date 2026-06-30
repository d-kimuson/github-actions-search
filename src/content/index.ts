import { observeUrlChange } from "@/content/util/url-change-event"
import { parseRepository } from "@/schema/repository"
import { initializeApp, cleanApp } from "./initialize-app"

let retryTimerId: number | undefined

const clearRetryTimer = () => {
  if (retryTimerId === undefined) return

  window.clearInterval(retryTimerId)
  retryTimerId = undefined
}

const initializeActionsSearch = () => {
  clearRetryTimer()

  const parsed = parseRepository(window.location.href)

  if (parsed === undefined) {
    cleanApp()
    return
  }

  if (initializeApp(parsed)) return

  let count = 0
  retryTimerId = window.setInterval(() => {
    if (count > 5) {
      clearRetryTimer()
      return
    }

    if (initializeApp(parsed)) {
      clearRetryTimer()
    } else {
      count += 1
    }
  }, 1000)
}

observeUrlChange()
initializeActionsSearch()

window.addEventListener("urlChange", initializeActionsSearch)
