import { createContext } from "preact"
import { useContext } from "preact/hooks"
import type { ComponentChildren, FunctionalComponent } from "preact"
import { fetchBranches } from "@/content/repository/branch"
import { fetchWorkflowFiles } from "@/content/repository/workflow"

const defaultRepository = {
  fetchWorkflowFiles,
  fetchBranches,
} as const

export type Repository = typeof defaultRepository

type ProviderProps = {
  children: ComponentChildren
}

const RepositoryContext = createContext<Repository>(defaultRepository)

export const RepositoryProvider: FunctionalComponent<ProviderProps> = ({
  children,
}) => {
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

export const MockRepositoryProvider: FunctionalComponent<
  ProviderProps & {
    repository: Partial<Repository>
  }
> = ({ children, repository }) => {
  return (
    <RepositoryContext.Provider value={{ ...defaultRepository, ...repository }}>
      {children}
    </RepositoryContext.Provider>
  )
}
