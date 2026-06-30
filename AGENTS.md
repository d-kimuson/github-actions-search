# AGENTS.md (github-actions-search)

## About Project

github-actions-search は GitHub Actions タブにワークフロー検索と個人用 pin 機能を追加する Chrome extension だ。Preact + Vite + vite-plugin-web-extension で content script をビルドし、GitHub の画面に UI を注入する。

## Communication

- Think in English.
- Always communicate with the user in Japanese.
- Documentation and code comments should preserve the existing language of the touched file.

## Reference

`docs/human/**` は人間向けドキュメントであり、通常の Agent 作業ではノイズになるため参照しない。人間向けの案内を作る・更新する・説明するなど、人間向けドキュメントが明示的に必要な場合だけ探索してよい。通常作業では下記の作業用 reference を優先する。

- Coding guideline: `.agents/skills/coding-guideline/SKILL.md`
- Coding process and Definition of Done: `docs/CODING_PROCESS.md`
- QA policy and procedures: `docs/QA_GUIDELINE.md`
- Branch naming conventions: `docs/BRANCH_NAMING.md`
- Architecture overview: `docs/ARCHITECTURE.md`
