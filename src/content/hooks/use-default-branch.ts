import { atom, useAtom } from "jotai"
import { useEffect } from "react"
import type { LoadableState } from "@/content/util/types"
import type { Repository } from "@/schema/repository"
import { useRepository } from "@/content/repository"

const defaultBranchAtom = atom<LoadableState<string>>({
  status: "idle",
})

export const useDefaultBranch = (repo: Repository) => {
  const [defaultBranchState, setDefaultBranchState] = useAtom(defaultBranchAtom)
  const { fetchBranches } = useRepository()

  useEffect(() => {
    if (defaultBranchState.status === "idle") {
      setDefaultBranchState({ status: "loading" })

      void fetchBranches(repo)
        .then(({ payload: { branches } }) => {
          console.log("branches", branches, branches.default.name)
          setDefaultBranchState({
            status: "loaded",
            value: branches.default.name,
          })
        })
        .catch((error: unknown) => {
          setDefaultBranchState({ status: "error", error })
        })
    }
  }, [defaultBranchState.status])

  if (
    defaultBranchState.status === "loading" ||
    defaultBranchState.status === "idle"
  ) {
    return {
      loading: true,
      defaultBranch: undefined,
      error: undefined,
    } as const
  }

  if (defaultBranchState.status === "error") {
    return {
      loading: false,
      defaultBranch: undefined,
      error: defaultBranchState.error,
    } as const
  }

  return {
    loading: false,
    defaultBranch: defaultBranchState.value,
    error: undefined,
  } as const
}
