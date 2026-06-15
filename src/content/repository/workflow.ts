import * as v from "valibot"
import type { Repository } from "@/schema/repository"

const entriesWrappedSchema = v.object({
  entries: v.record(v.string(), v.unknown()),
})
const flatSchema = v.record(v.string(), v.unknown())

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
    const entriesResult = v.safeParse(entriesWrappedSchema, data)
    if (entriesResult.success) {
      return Object.keys(entriesResult.output.entries)
    }

    const flatResult = v.safeParse(flatSchema, data)
    if (!flatResult.success) {
      console.error(
        "[github-actions-search] Failed to parse workflow files",
        flatResult.issues,
        data
      )
      throw new Error("Failed to parse workflow files response")
    }
    return Object.keys(flatResult.output)
  })
}
