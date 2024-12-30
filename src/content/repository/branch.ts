import * as v from "valibot"
import type { Repository } from "@/schema/repository"

const authorSchema = v.object({
  name: v.string(),
})

const branchSchema = v.object({
  name: v.string(),
  isDefault: v.boolean(),
  author: authorSchema,
})

const branchSearchSchema = v.object({
  payload: v.object({
    branches: v.object({
      default: branchSchema,
      yours: v.optional(v.array(branchSchema)),
      active: v.optional(v.array(branchSchema)),
    }),
  }),
})

export type BranchMeta = v.InferOutput<typeof branchSchema>
export type BranchSearchResult = v.InferOutput<typeof branchSearchSchema>

export const fetchBranches = async (
  repo: Repository
): Promise<BranchSearchResult> => {
  const response = await fetch(
    `https://github.com/${repo.owner}/${repo.repo}/branches?query=`,
    {
      headers: {
        accept: "application/json",
      },
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )

  const parsed = await response
    .json()
    .then((res) => v.safeParse(branchSearchSchema, res))

  if (!parsed.success) {
    console.error("Failed to parse response", parsed.issues)
    throw new Error("Failed to parse response")
  }

  return parsed.output
}
