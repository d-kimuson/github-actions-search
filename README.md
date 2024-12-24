# github-actions-search

GitHub の Actions タブが使いにくいので検索とかピン留めとかできるようにする Chrome 拡張機能です。

## 仕組み

- Chrome Extension で actions のページであれば検索用の拡張ボタンを UI に追加します
  - manifest で特定のページを指定しても直接そこを開いた時しかロードされないっぽいので、ページ遷移にフックして URL が actions のページだった場合に Element を追加します
  - load イベント等が読み込みタイミング的に使いづらいので、初期ロードがガバガバで多少時間がかかります
- 拡張機能は、ログインユーザーのセッションを使ってそのリポジトリの main ブランチの tree を読んで、.github/workflows/ 以下のファイルリストを取得します
- 取得したファイルリストに対してインクリメンタルサーチができます
  - `.github/workflows/ 以下のファイルリスト` が情報ソースなので、若干本家の workflow 一覧とは仕様が異なります
  - Ex. Dependabot Alerts など workflow ファイルが存在しないものが表示されない

## Installation

まだ公開する仕組みができてないので、この README に従って自前でビルドしてください

## 開発用セットアップ

.node-version に合わせたバージョンの Node.js と pnpm が必要です。

```shellscript
$ pnpm i
```

## 開発サーバーの起動

```shellscript
$ pnpm dev
```

Chrome が起動するので、GitHub にログインして actions ページに遷移することで試せます。

## ビルド

```shellscript
$ pnpm build
```

dist ディレクトリをそのままインストールすれば利用できます。
