"use client";

import { useState, useEffect, useRef, FC, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Pin, ExternalLink } from "lucide-react";
import { useWorkflowNames } from "@/content/hooks/use-workflow-names";
import { Repository } from "@/content/App";
import { usePins } from "@/content/hooks/use-pins";

type SearchItem = {
  name: string;
  url: string;
};

export const SearchDropdown: FC<{ repo: Repository }> = ({ repo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { loading, error, workflowNames } = useWorkflowNames(repo);
  const dummyData = useMemo((): SearchItem[] => {
    return (
      workflowNames?.map((name) => ({
        name,
        url: `https://github.com/${repo.owner}/${repo.repo}/actions/workflows/${name}`,
      })) ?? []
    );
  }, [workflowNames]);
  const { pins, addPin, isPinned, removePin } = usePins();

  const toggleSearch = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const filteredResults = dummyData
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .toSorted((a) => (isPinned(a.name) ? -1 : 1));
    setSearchResults(filteredResults);
  }, [searchQuery, dummyData, pins]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return null;
  if (error) return <p>Error: Something went wrong.</p>;

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
        検索する
      </Button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            marginTop: "8px",
            backgroundColor: "black",
            borderRadius: "6px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "12px",
            border: "1px solid white",
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
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: "32px",
                  fontSize: "14px",
                }}
              />
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                }}
              />
            </div>
            <Button onClick={toggleSearch} size="sm">
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
                {searchResults.map((result) => (
                  <li
                    key={result.name}
                    style={{
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => {
                        if (isPinned(result.name)) {
                          removePin(result.name);
                        } else {
                          addPin(result.name);
                        }
                      }}
                      style={{
                        color: isPinned(result.name) ? "yellow" : "gray",
                        border: "none",
                        outline: "none",
                        padding: "4px",
                      }}
                    >
                      <Pin size={14} />
                    </Button>
                    <a
                      href={result.url}
                      style={{
                        color: "white",
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
                  color: "#6B7280",
                }}
              >
                結果が見つかりません
              </p>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
