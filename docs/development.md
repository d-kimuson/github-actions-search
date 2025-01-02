# Development Guide

This guide explains how to set up the development environment and contribute to the github-actions-search Chrome extension.

## Prerequisites

- Node.js (version specified in `.node-version`)
- pnpm (package manager)
- Chrome browser for testing

## Install dependencies

```bash
$ pnpm i
```

## Start dev server

```bash
$ pnpm dev
```

After development server started, chrome browser automatically open.

You can check extension behavior by moving [github-actions-search's actions tab](https://github.com/d-kimuson/github-actions-search/actions).

## Other Development Commands

- `pnpm build` - Build production bundle
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm typecheck` - Check TypeScript types

## Project Structure

- `src/` - Source code
  - `content/` - Content scripts injected into GitHub pages
- `public/` - Static assets
- `test/` - Visual Regression Test files
- `dist/` - Build output

## Building

To create a production build:

1. Run `pnpm build`
2. The extension will be built to `dist/`
3. Load the `dist` directory as an unpacked extension in Chrome
