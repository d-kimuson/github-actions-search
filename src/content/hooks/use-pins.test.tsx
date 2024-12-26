import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { usePins } from "@/content/hooks/use-pins"
import {
  inMemoryStorage,
  LocalStorageProvider,
} from "@/content/util/local-storage"

describe("usePins", () => {
  it("初めて使用した時、空であるべき", () => {
    const { result } = renderHook(() => usePins(), {
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
    storage.setItem("pins", '["sample1.yaml"]')

    // when
    const { result } = renderHook(() => usePins(), {
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
    storage.setItem("pins", '["sample.yaml"]')

    // when
    const { result } = renderHook(() => usePins(), {
      wrapper: ({ children }) => (
        <LocalStorageProvider storage={storage}>
          {children}
        </LocalStorageProvider>
      ),
    })

    // then
    expect(result.current.pins).toStrictEqual(["sample.yaml"])
  })
})
