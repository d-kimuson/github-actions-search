"use client"

import { Search, Pin } from "lucide-react"
import { useState, useEffect, useRef, useMemo } from "react"
import type { Repository } from "@/schema/repository"
import type { FC } from "react"
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

export const SearchDropdown: FC<{ repo: Repository }> = ({ repo }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { loading, error, workflowFiles } = useWorkflowFiles(repo)
  const dummyData = useMemo((): SearchItem[] => {
    return (
      workflowFiles?.map((fileName) => ({
        name: fileName,
        url: `https://github.com/${repo.owner}/${repo.repo}/actions/workflows/${fileName}`,
      })) ?? []
    )
  }, [workflowFiles])
  const { pins, addPin, isPinned, removePin } = usePins(repo)

  const toggleSearch = () => {
    setIsOpen((prev) => !prev)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % searchResults.length)
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(
        (prevIndex) =>
          (prevIndex - 1 + searchResults.length) % searchResults.length
      )
    } else if (e.key === "Enter") {
      const selectedResult = searchResults[selectedIndex]
      if (selectedResult) {
        window.open(selectedResult.url, "_blank")
      }
    }
  }

  useEffect(() => {
    const filteredResults = dummyData
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .toSorted((a) => (isPinned(a.name) ? -1 : 1))
    setSearchResults(filteredResults)
  }, [searchQuery, dummyData, pins])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      const inputElement = dropdownRef.current?.querySelector("input")
      if (inputElement) {
        inputElement.focus()
      }
    }
  }, [isOpen])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [searchResults.length, selectedIndex])

  if (loading) return null
  if (error) return <p>Error: Something went wrong.</p>

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
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
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
            {searchResults.length > 0 ? (
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: "8px",
                }}
              >
                {searchResults.map((result, index) => (
                  <li
                    key={result.name}
                    style={{
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: "space-between",
                      border:
                        selectedIndex === index
                          ? "1px solid #E5E7EB"
                          : "1px solid transparent",
                      borderRadius: "4px",
                    }}
                  >
                    <Button
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
            ) : (
              <p
                style={{
                  fontSize: "14px",
                  // color: "#6B7280",
                }}
              >
                結果が見つかりません
              </p>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
