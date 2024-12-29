# github-actions-search

Language: 英語 | [日本語](./README.ja.md)

A Chrome extension that enhances GitHub's Actions tab with search and personal pinning capabilities.

![github-actions-search](https://github.com/user-attachments/assets/1d6ee83d-0247-4a73-838c-7815ed0aab58)

This extension addresses two major pain points when working with repositories containing numerous workflows:

1. the lack of search functionality in the Actions tab
2. the limitations of GitHub's built-in workflow pinning (team-shared with a 5-pin limit).

## Features

- Adds incremental search for workflow files
- Provides personal workflow pinning without the 5-pin limit
- Integrates seamlessly with GitHub's UI by adding controls to the Actions sidebar

## Installation

Download the latest release from the Releases page. Chrome Web Store publication is under consideration.

## How It Works

The extension monitors page navigation and adds search functionality to the Actions tab. It fetches workflow files from `.github/workflows/` in the repository's main branch using your GitHub session.

Note that the workflow list might slightly differ from GitHub's native list as it's based on actual workflow files (e.g., Dependabot Alerts without workflow files won't appear).

## Contribute

Contributions are welcome! Feel free to submit issues and pull requests.

See [docs/development.md](./docs/development.md).
