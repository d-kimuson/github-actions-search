import { Repository } from "@/content/App";

const supportedUrlRegex =
  /^https:\/\/github.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)\/actions$/;

export const parseRepository = (url: string): Repository | undefined => {
  const matched = url.match(supportedUrlRegex)?.groups;
  if (matched === undefined) {
    return undefined;
  }

  return {
    owner: matched.owner,
    repo: matched.repo,
  };
};
