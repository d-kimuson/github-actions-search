import type { Repository } from "@/schema/repository"
import type { FunctionalComponent } from "preact"
import { SearchDropdown } from "@/content/components/search-down"
import { RepositoryProvider } from "@/content/repository"
import { LocalStorageProvider } from "@/content/util/local-storage"

export const App: FunctionalComponent<{ repo: Repository }> = ({ repo }) => {
  return (
    <LocalStorageProvider>
      <RepositoryProvider>
        <SearchDropdown repo={repo} />
      </RepositoryProvider>
    </LocalStorageProvider>
  )
}
