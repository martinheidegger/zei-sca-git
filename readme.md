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

### Github の GraphQL API の使い方

まずは便利な [`graphql-fetch`](https://www.npmjs.com/package/graphql-fetch) パッケージと進捗をテストするために
[`tap`](https://www.npmjs.com/package/tap) パッケージをインストールしましょう。

```sh
$ npm install --save graphql-fetch isometric-fetch
$ npm install --save-dev tap
```

_(`graphql-fetch` のために `isometric-fetch` が必須です)_

Github の GraphQL スペックはこちらです： https://api.github.com/graphql
そのドキュメントによると以下ようにに API データをローろできます。

_(lib/loadTeams.js)_
```js
const fetch = require('graphql-fetch')('https://api.github.com/graphql')
```

アクセスのためにに [Github Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
が必要となります。コンゼプトプレースホルダのためにこれからは "ABCGithubIsSweetXYZ" を使います。

```js
const GITHUB_TOKEN = 'ABCGithubIsSweetXYZ'
```

スペックの上に便利なドキュメントがあります。[こちらに](https://developer.github.com/early-access/graphql/explorer/)
`login` の Organization の ID をロードのためにこのようになるはずです:

```js
module.exports = (login) =>
  fetch(`
    query Organization ($login: String!) {
      organization(login: $login) {
        id
      }
    }
  `, { login }, {
    headers: new Headers({
      Authorization: `bearer ${GITHUB_TOKEN}`
    })
  })
```

そのためのテストは簡単かけます。

_(../test/loadTeams.js)_
```js
const { test } = require('tap')
const loadTeams = require('../lib/loadTeams.js')

test('organization id をゲッツ', t =>
  loadTeams('nodeschool').then(result => {
    t.equals(result.data.organization.id, 'MDEyOk9yZ2FuaXphdGlvbjU0Mzc1ODc=')
  })
)
```

コードは書いてありますがスクリプトの設定はまだです。このように `package.json`
に追加してください。

```json
"scripts": {
  "test": "tap -- test/**"
}
```

これで今からは `$ npm test` でテストを動かすことができます。グリーンなはずです。

## 🛠 データベースの準備
GraphQL で Github のデータをアクセスしていますから GraphQL なでものために使いましょう！最近からは
GraphQL-as-as-Service のデータベースいくつかが出てきました。この実験のためにに Scaphold
は便利そうですのでアカウントを作りましょう Let's [create an account](https://scaphold.io/)!

_(ノート： `Scaphold` の発音は `Scaffold` と同じです)_

<img alt="スクリーンショット： Scaphold のサインアップフォーム" src="https://i.gyazo.com/ae41d9f25669b1069e281153e26a3e2b.png" width="200">

一応アカウントがあったらアプリが作られます。

<img alt="スクリーンショット： アップのフォーム" src="https://i.gyazo.com/e4ba1a68cb85f199f302f34ea93c13a2.png" width="370">

<img alt="スクリーンショット： アップの情報" src="https://i.gyazo.com/fd45405742040ab3f495bb37e8510c3c.png" width="380">

アップりが作ってあるから必要な Type を設定できます。少しだけ MySQL のテブル設定に似ています：

<img alt="スクリーンショット： Scaphold の "Add Type" のボタン" src="https://i.gyazo.com/4e164a5fe0799e620afec5b9a3f9e5f9.png" width="200">

このような Schema を設定してください [`./scaphold.schema`](./scaphold.schema)
_([`./scaphold.schema.json`](./scaphold.schema.json) は私の Schema のエキスポートしたファイルです)_.

このデータ Schema でチームのデータを保存できるようになりました。アップを作ってからは Scaphold
が API を用意してあります：

<img alt="スクリーンショット： Scaphold の "API link" ディスプレイ" src="https://i.gyazo.com/5708b34eaea0be439ec52c7eee289b1a.png" width="260">

**データベースをゲッツ!** 🎉

Scaphold は API だけではなくて API エクスプローラも用意しています。拝見したいなら[こちらへ](https://us-west-2.api.scaphold.io/graphql/zei-sca-git)。

### 🔒 セキュリティ

Scaphold のデフォルトでは誰でもが全てのデータ変化できます。設定で管理者以外の変化制限をつける
ことができます。

<img alt="スクリーンショット： Scaphold の許可ボタン" src="https://i.gyazo.com/16178c98310436c17757cf8dfa3b7fe0.png" width="80">

"Everyone" が "read" だけの制限をつけましょう

<img alt="スクリーンショット： Read のみの許可" src="https://i.gyazo.com/9c3ac80281829b72b6d7e841569de7a0.png" width="200">
