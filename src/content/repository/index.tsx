import { createContext, useContext } from "react"
import type { FC, PropsWithChildren } from "react"
import { fetchBranches } from "@/content/repository/branch"
import { fetchWorkflowFiles } from "@/content/repository/workflow"

const defaultRepository = {
  fetchWorkflowFiles,
  fetchBranches,
} as const

export type Repository = typeof defaultRepository

const RepositoryContext = createContext(defaultRepository)

export const RepositoryProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <RepositoryContext.Provider value={defaultRepository}>
      {children}
    </RepositoryContext.Provider>
  )
}

export const useRepository = () => {
  const repository = useContext(RepositoryContext)
  return repository
}

export const MockRepositoryProvider: FC<
  PropsWithChildren<{
    repository: Partial<Repository>
  }>
> = ({ children, repository }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    <RepositoryContext.Provider value={repository as Repository}>
      {children}
    </RepositoryContext.Provider>
  )
}
