import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { usePins } from "@/content/hooks/use-pins"
import {
  inMemoryStorage,
  LocalStorageProvider,
} from "@/content/util/local-storage"

describe("usePins", () => {
  const defaultOptions = {
    owner: "octocat",
    repo: "test-repo",
  }

  it("初めて使用した時、空であるべき", () => {
    const { result } = renderHook(() => usePins(defaultOptions), {
      wrapper: ({ children }) => (
        <LocalStorageProvider storage={inMemoryStorage()}>
          {children}
        </LocalStorageProvider>
      ),
    })

    expect(result.current.pins).toStrictEqual([])
  })

  it("addPin したとき、ピンが localStorage に永続化されるべき", () => {
    // given
    const storage = inMemoryStorage()
    storage.setItem("pins:octocat/test-repo", '["sample1.yaml"]')

    // when
    const { result } = renderHook(() => usePins(defaultOptions), {
      wrapper: ({ children }) => (
        <LocalStorageProvider storage={storage}>
          {children}
        </LocalStorageProvider>
      ),
    })
    act(() => {
      result.current.addPin("sample2.yaml")
    })

    // then
    expect(result.current.pins).toStrictEqual(["sample1.yaml", "sample2.yaml"])
  })

  it("ローカルストレージにピンが残っていた時、保存されていたピンを返すべき", () => {
    // given
    const storage = inMemoryStorage()
    storage.setItem("pins:octocat/test-repo", '["sample.yaml"]')

    // when
    const { result } = renderHook(() => usePins(defaultOptions), {
      wrapper: ({ children }) => (
        <LocalStorageProvider storage={storage}>
          {children}
        </LocalStorageProvider>
      ),
    })

    // then
    expect(result.current.pins).toStrictEqual(["sample.yaml"])
  })

  it("異なるリポジトリのピン留めが互いに影響しないこと", () => {
    // given
    const storage = inMemoryStorage()
    storage.setItem("pins:octocat/repo1", '["workflow1.yaml"]')
    storage.setItem("pins:octocat/repo2", '["workflow2.yaml"]')

    // when
    const { result: repo1Result } = renderHook(
      () => usePins({ owner: "octocat", repo: "repo1" }),
      {
        wrapper: ({ children }) => (
          <LocalStorageProvider storage={storage}>
            {children}
          </LocalStorageProvider>
        ),
      }
    )
    const { result: repo2Result } = renderHook(
      () => usePins({ owner: "octocat", repo: "repo2" }),
      {
        wrapper: ({ children }) => (
          <LocalStorageProvider storage={storage}>
            {children}
          </LocalStorageProvider>
        ),
      }
    )

    // then
    expect(repo1Result.current.pins).toStrictEqual(["workflow1.yaml"])
    expect(repo2Result.current.pins).toStrictEqual(["workflow2.yaml"])

    // when: repo1 に新しいピンを追加
    act(() => {
      repo1Result.current.addPin("workflow1-new.yaml")
    })

    // then: repo2 のピンは影響を受けない
    expect(repo1Result.current.pins).toStrictEqual([
      "workflow1.yaml",
      "workflow1-new.yaml",
    ])
    expect(repo2Result.current.pins).toStrictEqual(["workflow2.yaml"])
  })
})
