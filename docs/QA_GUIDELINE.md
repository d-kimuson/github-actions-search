# QA Guideline

このドキュメントは github-actions-search の機能変更に対する動作確認方針と実施手順をまとめる。lint、typecheck、format、build などのコード品質ゲートは `docs/CODING_PROCESS.md` の責務であり、ここではアプリケーションの振る舞いを確認する QA を扱う。

## 基本方針

- アプリ影響のある変更では、関連する Unit Test または VRT と、実ブラウザでの確認を組み合わせる。
- GitHub DOM や GitHub Internal API に依存するため、境界層の変更では fixture / snapshot が現実の GitHub 画面と乖離していないか注意する。
- UI 変更では Playwright VRT の snapshot 差分を確認する。
- 外部ログインが必要な確認は、ユーザーのブラウザ profile を使うか、既存 fixture / VRT で検証可能な範囲に切り分ける。

## Unit Test

目的:

- hook、repository adapter、storage utility の分岐を高速に検証する。
- GitHub API response や storage data の schema validation を固定する。

実施手順:

1. 変更対象に関連する `*.test.ts` / `*.test.tsx` を探す。
2. 正常系だけでなく、空データ・不正データ・エラー系が検証されているか確認する。
3. 不足している場合は Unit Test を追加する。
4. `pnpm test` または関連 test を実行する。

## Visual Regression Test

目的:

- built extension を Chromium に読み込み、GitHub Actions sidebar に追加される UI を実ブラウザで検証する。
- UI 差分を snapshot として確認する。

実行コマンド:

```bash
pnpm build
pnpm vrt
```

snapshot を更新する場合:

```bash
pnpm build
pnpm vrt:update
```

## Exploratory QA

目的:

- 自動テストでは拾いにくい DOM 注入、navigation、search input、pin 操作、非同期状態の違和感を確認する。

実施手順:

1. `pnpm build` で `dist/` を作る。
2. Chrome の拡張機能画面で `dist/` を unpacked extension として読み込む。
3. GitHub repository の Actions tab を開く。
4. 検索、pin / unpin、ページ遷移後の再注入、storage 復元を確認する。
5. console error と network error を確認する。

## QA Checklist

- [ ] 関連 Unit Test を確認し、不足があれば追加して実行した。
- [ ] UI 変更なら `pnpm build` と `pnpm vrt` を実行した、または未実行理由を記録した。
- [ ] GitHub Actions tab 上での探索的確認が必要な変更なら、実ブラウザで操作した。
- [ ] console error と network error を確認した。
- [ ] 問題が見つかった場合、再現手順と期待結果を記録し、必要なら自動テストへ落とし込んだ。
