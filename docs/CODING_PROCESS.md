# Coding Process

## Recommended Coding Process

このプロジェクトでは、厳格な型検査・lint による静的制約・Vitest / Playwright による振る舞い確認を組み合わせて品質を維持する。

開発は t-wada style の TDD を基本とする。小さく失敗するテストまたは再現手順を作り、実装し、品質ゲートを回して修正する。

## Definition of Done

タスク完了時は、タスク固有の acceptance criteria に加えて以下を満たすこと。

```bash
pnpm gatecheck check
```

`gatecheck` は変更差分に対して oxfmt / oxlint / cspell / typecheck / related Vitest / build を実行する。大きな変更や CI 相当の確認が必要な場合は、以下も明示的に実行する。

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

UI / extension behavior に影響する変更では、必要に応じて Playwright VRT も実行する。

```bash
pnpm vrt
```

## Notable Commands

| Command                | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `pnpm dev`             | Vite dev server を起動する                       |
| `pnpm build`           | production extension を `dist/` にビルドする     |
| `pnpm typecheck`       | 単一 `tsconfig.json` を `tsgo` で型検査する      |
| `pnpm lint`            | oxfmt / oxlint / cspell を check mode で実行する |
| `pnpm fix`             | oxfmt / oxlint の自動修正を実行する              |
| `pnpm test`            | Vitest unit tests を実行する                     |
| `pnpm vrt`             | Playwright visual regression tests を実行する    |
| `pnpm vrt:update`      | VRT snapshot を更新する                          |
| `pnpm gatecheck check` | 差分ベースの品質ゲートを実行する                 |

## Release / Snapshot Notes

- release workflow は `pnpm build` 後に `dist.zip` を作成し、`release-it` で GitHub release を作る。
- snapshot 更新は `pnpm build` → `pnpm vrt:update` の順で行う。
- VRT snapshot の変更は自動生成差分が大きくなりやすいため、UI 意図と一致するか確認してから取り込む。
