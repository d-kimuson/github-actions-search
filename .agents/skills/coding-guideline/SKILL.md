---
name: coding-guideline
description: github-actions-search のコードを書く・レビューする・リファクタリングするときに使用するプロジェクト固有ガイドライン。
---

# Coding Guideline

この skill は github-actions-search の実装判断に使う。構文レベルのルールはできるだけ `oxlint.config.ts` と `tsconfig.json` に寄せ、ここには設計判断を書く。

## Project Shape

- Preact + Vite + `vite-plugin-web-extension` の Chrome extension。
- Runtime entrypoint は `src/content/index.ts`。
- GitHub Actions tab の DOM に content script から UI を注入する。
- GitHub API / browser extension storage / DOM は外部境界として扱う。

## Type-Driven Correctness

- 状態や分岐は discriminated union で表現し、不正状態を型で作れない形に寄せる。
- 外部データは `valibot` schema などで validation してから使用する。
- `any`、non-null assertion、根拠のない type assertion は避ける。
- 設定 object は必要に応じて `as const satisfies` で literal type と構造制約を両立する。

## Boundary Separation

- `src/content/repository/` は GitHub からデータを取得する境界層。
- `src/content/util/local-storage.tsx` は browser extension storage の境界層。
- UI component は repository / storage の詳細を直接知らない形にする。
- hook は UI state の composition を担当し、I/O の詳細は boundary module に閉じ込める。

## Testing

- Unit tests は対象 source の近くに `*.test.ts` / `*.test.tsx` として置く。
- GitHub API response、storage data、URL / DOM 由来の値は正常系だけでなく不正・空・失敗ケースも検証する。
- Extension としての表示差分は `pnpm build` 後に `pnpm vrt` で確認する。

## UI / Preact

- 既存 component style と shadcn-ui 由来の構造を尊重する。
- state は最小限にし、render 中に計算できる派生値は state にしない。
- effect は DOM / browser API / external system との同期に限定する。
