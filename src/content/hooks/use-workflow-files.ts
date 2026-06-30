import { useLayoutEffect, useState } from "preact/hooks"
import type { LoadableState } from "@/content/util/types"
import type { Repository } from "@/schema/repository"
import { useDefaultBranch } from "@/content/hooks/use-default-branch"
import { useRepository } from "@/content/repository"

type RepositoryLoadableState<T> = LoadableState<T> & {
  repoKey: string
}

const getRepoKey = (repo: Repository) => `${repo.owner}/${repo.repo}`

const createIdleState = <T>(repoKey: string): RepositoryLoadableState<T> => ({
  repoKey,
  status: "idle",
})

export const useWorkflowFiles = (
  repo: Repository,
  options: { enabled?: boolean } = {}
) => {
  const { enabled = true } = options
  const repoKey = getRepoKey(repo)
  const [workflowFilesState, setWorkflowFilesState] = useState<
    RepositoryLoadableState<string[]>
  >(() => createIdleState(repoKey))
  const { defaultBranch, error: defaultBranchError } = useDefaultBranch(repo, {
    enabled,
  })
  const { fetchWorkflowFiles } = useRepository()

  const currentState =
    workflowFilesState.repoKey === repoKey
      ? workflowFilesState
      : createIdleState<string[]>(repoKey)

  useLayoutEffect(() => {
    if (
      !enabled ||
      defaultBranch === undefined ||
      currentState.status !== "idle"
    ) {
      return
    }

    let canceled = false
    setWorkflowFilesState({ repoKey, status: "loading" })

    void fetchWorkflowFiles(repo, defaultBranch)
      .then((workflowFiles) => {
        if (canceled) return
        setWorkflowFilesState({
          repoKey,
          status: "loaded",
          value: workflowFiles,
        })
      })
      .catch((error: unknown) => {
        if (canceled) return
        setWorkflowFilesState({ repoKey, status: "error", error })
      })

    return () => {
      canceled = true
    }
  }, [defaultBranch, enabled, fetchWorkflowFiles, repo, repoKey])

  if (defaultBranchError !== undefined) {
    return {
      loading: false,
      workflowFiles: undefined,
      error: defaultBranchError,
    } as const
  }

  if (currentState.status === "idle") {
    return {
      loading: enabled,
      workflowFiles: undefined,
      error: undefined,
    } as const
  }

  if (currentState.status === "loading") {
    return {
      loading: true,
      workflowFiles: undefined,
      error: undefined,
    } as const
  }

  if (currentState.status === "error") {
    return {
      loading: false,
      workflowFiles: undefined,
      error: currentState.error,
    } as const
  }

  return {
    loading: false,
    workflowFiles: currentState.value,
    error: undefined,
  } as const
}
