# ⏱ Zei - 🏢 Sca - 😺 Git
[zeit/now](https://zeit.co/now) - [scaphold](https://scaphold.io) -  [github](https://developer.github.com)

今日は入りやすいモダーンやオープンな技術を利用するちっちゃなさサービスを書きましょう！

## 💡 コンゼプト

### 問題
このサービスで対応したいのは Github の問題です。実は Github の Organization は "public"なチームがありますが、
Organization 以外のかたはそのチームを見えません。

例えば、ログインしていない場合または NodeSchool のメンバーじゃない場合では
[NodeSchool のページ](https://github.com/nodeschool)にはチームタブがありません。その
タブの内容は誰でも見えるようにしたいです。

### 解決
対応するためにちっちゃな Node.js サーバーを書きましょう。そのサーバーは Github
からのチームを読んでデータベースに保蔵んして、誰でもアクセスできるようにしています。

### CPU & Memory
[Zeit/now](https://zeit.co/now) は無料の CPU をオーペンソースのプロジェクトんにオファーしています。その上は
Zeit のデプロイシステムはめっちゃ簡単なので絶対便利になるでしょう。

### ストレージ
今までよくはやっている REST API の変われいにもうちょっと格好よく開発したいです。そのためは
[GraphQL](http://graphql.org/) の API を用意したいです。もしかしたさらにフレキシブルです。もしかしたもっと早いです。

私たちの運がいいです。[scaphold](https://scaphold.io) というサービスは GraphQL のデータベースを少ないデータのために無料に出しています。楽しみです！

## 😺 Github API
以前に Github の API 使っている方は今が古い話になると思うでしょうか？違っています！最近は
**Github の[新しい "early-access" プログラム](https://developer.github.com/early-access/)では
[GraphQL API](https://developer.github.com/early-access/graphql/) を公開しました！**

Node でその API アクセスをためにまずプロジェクトの準備が必要となります。第一は `zei-sca-git`
のプロジェクトを init にしましょう：
_(メモ: この記事は Git と Node 7 があると仮定しています。)_

```sh
$ mkdir zei-sca-git; cd zei-sca-git
$ npm init -y
$ git init
```

そしてはよくある Node の設定をしましょう。

1. `package.json` に `"private": true` のフラッグをつけましょう、そうすると失敗で project
    を npm にプッシュできません。
2. `author`、 `description` や `keyword` のメタデータを `package.json`
    に追加しましょう。目的がちゃんとわかるように。
3. そして `node_modules` を `.gitignore` に追加しましょう。

    ```
    $ echo "node_modules" >> .gitignore
    ```

全てできてから初めてのコミットができる：

```sh
$ git add .; git commit -m "初めてのコミット"
```
