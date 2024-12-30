import { setTimeout } from "node:timers/promises"
import { renderHook, act } from "@testing-library/react"
import { describe, it, vi, expect } from "vitest"
import type { BranchSearchResult } from "@/content/repository/branch"
import { useDefaultBranch } from "@/content/hooks/use-default-branch"
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
} as const satisfies BranchSearchResult

describe("useDefaultBranch", () => {
  const repo = { owner: "d-kimuson", repo: "github-actions-search" }

  it("呼び出し時は loading 状態を返すこと", () => {
    const { result } = renderHook(() => useDefaultBranch(repo), {
      wrapper: ({ children }) => (
        <MockRepositoryProvider
          repository={{
            fetchBranches: vi.fn(() => Promise.resolve(response)),
          }}
        >
          {children}
        </MockRepositoryProvider>
      ),
    })

    expect(result.current).toStrictEqual({
      error: undefined,
      loading: true,
      defaultBranch: undefined,
    })
  })

  it("レスポンスを受け取った後なら loaded 状態を返すこと", async () => {
    const { result } = renderHook(() => useDefaultBranch(repo), {
      wrapper: ({ children }) => (
        <MockRepositoryProvider
          repository={{
            fetchBranches: vi.fn(() => Promise.resolve(response)),
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
      defaultBranch: "main",
    })
  })
})
