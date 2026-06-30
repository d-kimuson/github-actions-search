"use client"

import { Pin, Search } from "lucide-preact"
import { useEffect, useMemo, useRef, useState } from "preact/hooks"
import type { Repository } from "@/schema/repository"
import type { FunctionalComponent } from "preact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePins } from "@/content/hooks/use-pins"
import { useWorkflowFiles } from "@/content/hooks/use-workflow-files"
import { colors } from "@/content/theme"

type SearchItem = {
  name: string
  url: string
}

const createWorkflowUrl = (repo: Repository, fileName: string) =>
  `https://github.com/${repo.owner}/${repo.repo}/actions/workflows/${fileName}`

export const SearchDropdown: FunctionalComponent<{ repo: Repository }> = ({
  repo,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldLoadWorkflowFiles, setShouldLoadWorkflowFiles] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { loading, error, workflowFiles } = useWorkflowFiles(repo, {
    enabled: shouldLoadWorkflowFiles,
  })
  const { pins, addPin, isPinned, removePin } = usePins(repo)

  const workflowItems = useMemo((): SearchItem[] => {
    return (
      workflowFiles?.map((fileName) => ({
        name: fileName,
        url: createWorkflowUrl(repo, fileName),
      })) ?? []
    )
  }, [repo, workflowFiles])

  const searchResults = useMemo(() => {
    const normalizedSearchQuery = searchQuery.toLowerCase()
    return workflowItems
      .filter((item) => item.name.toLowerCase().includes(normalizedSearchQuery))
      .toSorted((a, b) => {
        const aPinned = isPinned(a.name)
        const bPinned = isPinned(b.name)
        if (aPinned === bPinned) return a.name.localeCompare(b.name)
        return aPinned ? -1 : 1
      })
  }, [isPinned, searchQuery, workflowItems, pins])

  const toggleSearch = () => {
    setShouldLoadWorkflowFiles(true)
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setShouldLoadWorkflowFiles(true)
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return
      if (dropdownRef.current?.contains(event.target)) return

      setIsOpen(false)
      setSearchQuery("")
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const inputElement = dropdownRef.current?.querySelector("input")
    inputElement?.focus()
  }, [isOpen])

  useEffect(() => {
    if (selectedIndex < searchResults.length) return

    setSelectedIndex(0)
  }, [searchResults.length, selectedIndex])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (searchResults.length === 0) return

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setSelectedIndex((prevIndex) => (prevIndex + 1) % searchResults.length)
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        setSelectedIndex(
          (prevIndex) =>
            (prevIndex - 1 + searchResults.length) % searchResults.length
        )
      } else if (event.key === "Enter") {
        const selectedResult = searchResults[selectedIndex]
        if (selectedResult) {
          window.open(selectedResult.url, "_blank")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, searchResults, selectedIndex])

  const statusMessage = (() => {
    if (error) return "ワークフロー一覧の読み込みに失敗しました"
    if (!shouldLoadWorkflowFiles || loading)
      return "ワークフロー一覧を読み込み中..."
    if (searchResults.length === 0) return "結果が見つかりません"
    return undefined
  })()

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
      }}
      ref={dropdownRef}
    >
      <Button
        aria-busy={loading}
        onClick={toggleSearch}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
        }}
      >
        <Search size={18} />
        ワークフローを検索
      </Button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            marginTop: "8px",
            backgroundColor: colors.backgroundColor,
            borderRadius: "6px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "12px",
            border: `1px solid ${colors.buttonBorderColor}`,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                position: "relative",
                flexGrow: 1,
              }}
            >
              <Input
                placeholder="検索キーワードを入力"
                value={searchQuery}
                onValueInput={setSearchQuery}
                style={{
                  paddingLeft: "32px",
                  fontSize: "14px",
                  color: colors.textColor,
                }}
              />
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.textColor,
                }}
              />
            </div>
            <Button
              style={{
                color: colors.textColor,
              }}
              onClick={toggleSearch}
              size="sm"
            >
              閉じる
            </Button>
          </div>
          <ScrollArea
            style={{
              maxHeight: "70vh",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #E5E7EB",
              padding: "8px",
            }}
          >
            {statusMessage !== undefined ? (
              <p
                style={{
                  fontSize: "14px",
                  color: colors.textColor,
                  margin: 0,
                }}
              >
                {statusMessage}
              </p>
            ) : (
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {searchResults.map((result, index) => (
                  <li
                    key={result.name}
                    style={{
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      border:
                        selectedIndex === index
                          ? "1px solid #E5E7EB"
                          : "1px solid transparent",
                      borderRadius: "4px",
                    }}
                  >
                    <Button
                      aria-label={
                        isPinned(result.name)
                          ? `${result.name} のピン留めを外す`
                          : `${result.name} をピン留めする`
                      }
                      onClick={() => {
                        if (isPinned(result.name)) {
                          removePin(result.name)
                        } else {
                          addPin(result.name)
                        }
                      }}
                      style={{
                        color: "gray",
                        border: "none",
                        outline: "none",
                        padding: "4px",
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      }}
                    >
                      <Pin
                        fill={isPinned(result.name) ? "yellow" : "gray"}
                        size={14}
                      />
                    </Button>
                    <a
                      href={result.url}
                      style={{
                        color: colors.textColor,
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
