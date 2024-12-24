import { observeUrlChange } from "@/content/util/url-change-event";
import { initializeApp, cleanApp } from "./initialize-app";
import { parseRepository } from "@/content/util/parse-repository";

observeUrlChange();

window.addEventListener("urlChange", () => {
  const parsed = parseRepository(window.location.href);

  if (parsed === undefined) {
    cleanApp();
    return;
  }
  if (initializeApp(parsed)) return;

  let count = 0;
  const id = window.setInterval(() => {
    if (count > 5) {
      clearInterval(id);
    }

    if (initializeApp(parsed)) {
      window.clearInterval(id);
    } else {
      count += 1;
    }
  }, 2000);
});
