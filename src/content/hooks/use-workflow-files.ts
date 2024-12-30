import { atom, useAtom } from "jotai"
import { useEffect } from "react"
import type { LoadableState } from "@/content/util/types"
import type { Repository } from "@/schema/repository"
import { useDefaultBranch } from "@/content/hooks/use-default-branch"
import { useRepository } from "@/content/repository"

const workflowFilesAtom = atom<LoadableState<string[]>>({
  status: "idle",
})

export const useWorkflowFiles = (repo: Repository) => {
  const [workflowFilesState, setWorkflowFilesState] = useAtom(workflowFilesAtom)
  const { defaultBranch } = useDefaultBranch(repo)
  const { fetchWorkflowFiles } = useRepository()

  useEffect(() => {
    if (defaultBranch === undefined) {
      return
    }

    if (workflowFilesState.status === "idle") {
      setWorkflowFilesState({ status: "loading" })

      void fetchWorkflowFiles(repo, defaultBranch)
        .then((workflowFiles) => {
          setWorkflowFilesState({
            status: "loaded",
            value: workflowFiles,
          })
        })
        .catch((error: unknown) => {
          setWorkflowFilesState({ status: "error", error })
        })
    }
  }, [defaultBranch, workflowFilesState.status])

  if (
    workflowFilesState.status === "loading" ||
    workflowFilesState.status === "idle"
  ) {
    return {
      loading: true,
      workflowFiles: undefined,
      error: undefined,
    } as const
  }

  if (workflowFilesState.status === "error") {
    return {
      loading: false,
      workflowFiles: undefined,
      error: workflowFilesState.error,
    } as const
  }

  return {
    loading: false,
    workflowFiles: workflowFilesState.value,
    error: undefined,
  } as const
}
