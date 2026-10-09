// GitHub の DOM はハッシュ付きクラス名や動的 ID が頻繁に変わるため、
// タグ・aria-label・href パターンなどの安定した手がかりだけで探す。

const workflowLinkSelector = 'a[href*="/actions/workflows/"]'

// workflow 一覧の nav (aria-label="Actions workflows") を含む要素を sidebar とみなす
export const findSidebarElement = (root: ParentNode): Element | undefined => {
  const navElements = Array.from(root.querySelectorAll("nav")).filter(
    (nav) => nav.querySelector(workflowLinkSelector) !== null
  )
  const nav =
    navElements.find((elm) =>
      elm.getAttribute("aria-label")?.toLowerCase().includes("workflow")
    ) ?? navElements[0]

  return nav?.parentElement ?? undefined
}
