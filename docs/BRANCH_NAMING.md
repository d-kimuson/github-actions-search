# Branch Naming Convention

## 現状

既存の remote branch には以下のような命名が混在している。

- `feat/auto-focus-on-input-erea`
- `issues/#4`
- `kaishin/ogasawara/fix-tree-commit-info-entries-format`
- `ogasawara/set-color`
- `update-snapshots`

今後は、短く機械的に扱いやすい `<type>/<short-description>` を基本とする。

## Format

```text
<type>/<short-description>
```

## Types

| Type       | When to use               |
| ---------- | ------------------------- |
| `feat`     | New feature or capability |
| `fix`      | Bug fix                   |
| `chore`    | Tooling, CI, dependencies |
| `docs`     | Documentation only        |
| `refactor` | Code restructuring        |
| `test`     | Test updates              |
| `hotfix`   | Urgent production fix     |

## Rules

- lowercase を使う。
- 単語区切りは hyphen にする。
- description は 2〜5 語程度で短くする。
- issue 番号を含める場合は `fix/4-workflow-list` のように `#` を使わない。
- 自動 snapshot 更新 branch は既存 workflow に合わせて `update-snapshots` を許容する。

## Examples

Good:

- `feat/search-input-shortcut`
- `fix/default-branch-fetch`
- `chore/oxlint-migration`
- `docs/qa-guideline`
- `test/pin-storage`

Bad:

- `Feature/AddUserAuth`（大文字と camel case）
- `fix`（description がない）
- `issues/#4`（記号を含み扱いにくい）
- `my-branch`（type prefix がない）
