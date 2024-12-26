import { setTimeout } from "node:timers/promises"
import { renderHook, act } from "@testing-library/react"
import { describe, it, vi, expect } from "vitest"
import { useWorkflowFiles } from "@/content/hooks/use-workflow-files"
import { MockRepositoryProvider } from "@/content/repository"

describe("useWorkflowFiles", () => {
  const repo = { owner: "d-kimuson", repo: "github-actions-search" }

  it("呼び出し時は loading 状態を返すこと", () => {
    const { result } = renderHook(() => useWorkflowFiles(repo), {
      wrapper: ({ children }) => (
        <MockRepositoryProvider
          repository={{
            fetchWorkflowFiles: vi.fn(() => Promise.resolve(["sample.yaml"])),
          }}
        >
          {children}
        </MockRepositoryProvider>
      ),
    })

    expect(result.current).toStrictEqual({
      error: undefined,
      loading: true,
      workflowFiles: undefined,
    })
  })

  it("レスポンスを受け取った後なら loaded 状態を返すこと", async () => {
    const { result } = renderHook(() => useWorkflowFiles(repo), {
      wrapper: ({ children }) => (
        <MockRepositoryProvider
          repository={{
            fetchWorkflowFiles: vi.fn(() => Promise.resolve(["sample.yaml"])),
          }}
        >
          {children}
        </MockRepositoryProvider>
      ),
    })

    await act(async () => {
      await setTimeout(100)
    })

    expect(result.current).toStrictEqual({
      error: undefined,
      loading: false,
      workflowFiles: ["sample.yaml"],
    })
  })
})
