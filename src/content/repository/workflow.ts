import * as v from "valibot"
import type { Repository } from "@/schema/repository"

const treeInfoSchema = v.union([
  v.object({ entries: v.record(v.string(), v.unknown()) }),
  v.record(v.string(), v.unknown()),
])

export const fetchWorkflowFiles = async (
  repo: Repository,
  defaultBranch: string
): Promise<string[]> => {
  const response = await fetch(
    `https://github.com/${repo.owner}/${repo.repo}/tree-commit-info/${defaultBranch}/.github/workflows`,
    {
      headers: {
        accept: "application/json",
      },
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )

  return await response.json().then((data: unknown) => {
    const parsed = v.safeParse(treeInfoSchema, data)
    if (!parsed.success) {
      console.error(
        "[github-actions-search] Failed to parse workflow files",
        parsed.issues,
        data
      )
      throw new Error("Failed to parse workflow files response")
    }
    const files =
      "entries" in parsed.output ? parsed.output.entries : parsed.output
    return Object.keys(files)
  })
}
