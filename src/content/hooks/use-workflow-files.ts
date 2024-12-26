import { useEffect, useState } from "react"
import type { LoadableState } from "@/content/util/types"
import type { Repository } from "@/schema/repository"
import { useRepository } from "@/content/repository"

export const useWorkflowFiles = (repo: Repository) => {
  const [workflowFilesState, setWorkflowFilesState] = useState<
    LoadableState<string[]>
  >({ status: "idle" })
  const { fetchWorkflowFiles } = useRepository()

  useEffect(() => {
    if (workflowFilesState.status === "idle") {
      setWorkflowFilesState({ status: "loading" })

      void fetchWorkflowFiles(repo)
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
  }, [])

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
