import * as v from "valibot"

const supportedUrlRegex =
  /^https:\/\/github.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)\/actions$/

const repositorySchema = v.object({
  owner: v.string(),
  repo: v.string(),
})

export type Repository = v.InferOutput<typeof repositorySchema>

export const parseRepository = (url: string): Repository | undefined => {
  const matched = url.match(supportedUrlRegex)?.groups
  if (matched === undefined) {
    return undefined
  }

  return v.parse(repositorySchema, matched)
}
