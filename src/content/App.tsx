import type { Repository } from "@/schema/repository"
import type { FC } from "react"
import { SearchDropdown } from "@/content/components/search-down"
import { RepositoryProvider } from "@/content/repository"
import { LocalStorageProvider } from "@/content/util/local-storage"

export const App: FC<{ repo: Repository }> = ({ repo }) => {
  return (
    <LocalStorageProvider>
      <RepositoryProvider>
        <SearchDropdown repo={repo} />
      </RepositoryProvider>
    </LocalStorageProvider>
  )
}
