import type { FC } from "react"
import { SearchDropdown } from "@/content/components/search-down"

export type Repository = {
  owner: string
  repo: string
}

export const App: FC<{ repo: Repository }> = ({ repo }) => {
  return <SearchDropdown repo={repo} />
}
