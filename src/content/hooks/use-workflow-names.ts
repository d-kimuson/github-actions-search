import { useEffect, useState } from "react";
import { Repository } from "@/content/App";
import { LoadableState } from "@/content/util/types";

const fetchWorkflowNames = async (repo: Repository): Promise<string[]> => {
  const response = await fetch(
    `https://github.com/${repo.owner}/${repo.repo}/tree-commit-info/main/.github/workflows`,
    {
      headers: {
        accept: "application/json",
      },
      method: "GET",
      mode: "cors",
      credentials: "include",
    },
  );

  return await response.json().then((data) => Object.keys(data));
};

const escapedNameRegExp = /^\"(.*?)\"$/;
const unEscapeQuotes = (name: string) => name.replace(escapedNameRegExp, "$1");

export const useWorkflowNames = (repo: Repository) => {
  const [workflowNamesState, setWorkflowNamesState] = useState<
    LoadableState<string[]>
  >({ status: "idle" });

  useEffect(() => {
    if (workflowNamesState.status === "idle") {
      setWorkflowNamesState({ status: "loading" });

      void fetchWorkflowNames(repo)
        .then((workflowNames) => {
          setWorkflowNamesState({
            status: "loaded",
            value: workflowNames.map(unEscapeQuotes),
          });
        })
        .catch((error) => {
          setWorkflowNamesState({ status: "error", error });
        });
    }
  }, []);

  if (
    workflowNamesState.status === "loading" ||
    workflowNamesState.status === "idle"
  ) {
    return {
      loading: true,
      workflowNames: undefined,
      error: undefined,
    } as const;
  }

  if (workflowNamesState.status === "error") {
    return {
      loading: false,
      workflowNames: undefined,
      error: workflowNamesState.error,
    } as const;
  }

  return {
    loading: false,
    workflowNames: workflowNamesState.value,
    error: undefined,
  } as const;
};
