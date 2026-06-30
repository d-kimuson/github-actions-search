# Development Guide

This guide explains how to set up the development environment and contribute to the github-actions-search Chrome extension.

## Prerequisites

- Node.js (version specified in `.node-version`)
- pnpm 11 (pinned in `package.json#packageManager`)
- Chrome browser for manual extension testing

## Install dependencies

```bash
pnpm i
```

## Start dev server

```bash
pnpm dev
```

After the development server starts, check extension behavior by opening [github-actions-search's actions tab](https://github.com/d-kimuson/github-actions-search/actions).

## Other Development Commands

- `pnpm gatecheck check` - Run the diff-aware local quality gate
- `pnpm typecheck` - Check TypeScript types with tsgo
- `pnpm lint` - Run oxfmt, oxlint, and cspell checks
- `pnpm fix` - Apply oxfmt and oxlint fixes
- `pnpm test` - Run Vitest tests
- `pnpm build` - Build production bundle
- `pnpm vrt` - Run Playwright visual regression tests
- `pnpm vrt:update` - Update visual regression snapshots

## Project Structure

- `src/` - Source code
  - `content/` - Content scripts injected into GitHub pages
  - `components/ui/` - Shared Preact UI components
- `public/` - Static assets
- `test/` - Visual Regression Test files
- `dist/` - Build output
- `docs/` - Project documentation

## Building

To create a production build:

1. Run `pnpm build`
2. The extension will be built to `dist/`
3. Load the `dist` directory as an unpacked extension in Chrome
