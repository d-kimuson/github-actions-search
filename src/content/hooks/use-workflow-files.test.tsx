import { renderHook, waitFor } from "@testing-library/preact"
import { describe, expect, it, vi } from "vitest"
import { useWorkflowFiles } from "@/content/hooks/use-workflow-files"
import { MockRepositoryProvider } from "@/content/repository"

const response = {
  payload: {
    branches: {
      default: {
        name: "main",
        isDefault: true,
        author: {
          name: "d-kimuson",
        },
      },
    },
  },
}

describe("useWorkflowFiles", () => {
  const repo = { owner: "d-kimuson", repo: "github-actions-search" }

  it("呼び出し時は loading 状態を返すこと", () => {
    const { result } = renderHook(() => useWorkflowFiles(repo), {
      wrapper: ({ children }) => (
        <MockRepositoryProvider
          repository={{
            fetchBranches: vi.fn(() => Promise.resolve(response)),
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
            fetchBranches: vi.fn(() => Promise.resolve(response)),
            fetchWorkflowFiles: vi.fn(() => Promise.resolve(["sample.yaml"])),
          }}
        >
          {children}
        </MockRepositoryProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        error: undefined,
        loading: false,
        workflowFiles: ["sample.yaml"],
      })
    })
  })
})
