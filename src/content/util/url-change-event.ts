let oldUrl = ""

const observer = new MutationObserver(() => {
  if (oldUrl !== window.location.href) {
    oldUrl = window.location.href
    window.dispatchEvent(new CustomEvent("urlChange"))
  }
})

export const observeUrlChange = () => {
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  })
}
