import { useLayoutEffect, useState } from "preact/hooks"
import type { LoadableState } from "@/content/util/types"
import type { Repository } from "@/schema/repository"
import { useRepository } from "@/content/repository"

type RepositoryLoadableState<T> = LoadableState<T> & {
  repoKey: string
}

const getRepoKey = (repo: Repository) => `${repo.owner}/${repo.repo}`

const createIdleState = <T>(repoKey: string): RepositoryLoadableState<T> => ({
  repoKey,
  status: "idle",
})

export const useDefaultBranch = (
  repo: Repository,
  options: { enabled?: boolean } = {}
) => {
  const { enabled = true } = options
  const repoKey = getRepoKey(repo)
  const [defaultBranchState, setDefaultBranchState] = useState<
    RepositoryLoadableState<string>
  >(() => createIdleState(repoKey))
  const { fetchBranches } = useRepository()

  const currentState =
    defaultBranchState.repoKey === repoKey
      ? defaultBranchState
      : createIdleState<string>(repoKey)

  useLayoutEffect(() => {
    if (!enabled || currentState.status !== "idle") {
      return
    }

    let canceled = false
    setDefaultBranchState({ repoKey, status: "loading" })

    void fetchBranches(repo)
      .then(({ payload: { branches } }) => {
        if (canceled) return
        setDefaultBranchState({
          repoKey,
          status: "loaded",
          value: branches.default.name,
        })
      })
      .catch((error: unknown) => {
        if (canceled) return
        setDefaultBranchState({ repoKey, status: "error", error })
      })

    return () => {
      canceled = true
    }
  }, [enabled, fetchBranches, repo, repoKey])

  if (currentState.status === "idle") {
    return {
      loading: enabled,
      defaultBranch: undefined,
      error: undefined,
    } as const
  }

  if (currentState.status === "loading") {
    return {
      loading: true,
      defaultBranch: undefined,
      error: undefined,
    } as const
  }

  if (currentState.status === "error") {
    return {
      loading: false,
      defaultBranch: undefined,
      error: currentState.error,
    } as const
  }

  return {
    loading: false,
    defaultBranch: currentState.value,
    error: undefined,
  } as const
}
