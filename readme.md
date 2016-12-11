# ⏱ Zei - 🏢 Sca - 😺 Git
[zeit/now](https://zeit.co/now) - [scaphold](https://scaphold.io) -  [github](https://developer.github.com)

簡単に使えるモダンでオープンな技術を使って小さなサービスを作る方法。

## 💡 コンゼプト

### 問題
このサービスで解決したいものは Github における問題です。実は Github の Organization は
"public" なチームがありますが、Organization のメンバー以外からはそのチームを見ることができません。

例えば、ログインしていない場合、あるいは NodeSchool のメンバーではない場合、
[NodeSchool のページ](https://github.com/nodeschool)にはチームのタブがありません。
そのタブの内容を誰にでも見れるようにしてみましょう。

### 解決
この問題を解決するために、小さなサーバーを Node.js 書きます。そのサーバーは Github
からチームの一覧を読み込み、データベースに保存し、誰からでもアクセスできるようにします。

### CPU & Memory
[Zeit/now](https://zeit.co/now) は無料の CPU をオーペンソースのプロジェクトに提供しています。
Zeit のデプロイシステムは非常に簡単なので、このようなプロジェクトには最適です。

### ストレージ
REST API が無難なのは言うまでもありませんが、もう少し格好よく開発をしてみましょう。皆さんも御存知の通り、
[GraphQL](http://graphql.org/) の API を試してみましょう。もしかしたら、REST API　よりも
さらにフレキシブルです。そして、速度も早いかもしれません。

幸運なことに、[scaphold](https://scaphold.io) というサービスは GraphQL のデータベースを
少ないデータのために無料で提供しています。使うほかありませんね！

## 😺 Github API
昔から Github の API 使っている方は、REST API を使わなきゃいけないと思ったかもしれません。
それは違います！最近、**Github の[新しい "early-access" プログラム](https://developer.github.com/early-access/) が
[GraphQL API](https://developer.github.com/early-access/graphql/) を公開しました！**

Node でその API アクセスを試すために、まずプロジェクトの準備をしましょう。第一は `zei-sca-git`
のプロジェクトを構築してみましょう：
_(メモ： この記事は Git と Node 7 がインストールされている前提でチュートリアルを進めます。)_

```sh
$ mkdir zei-sca-git; cd zei-sca-git
$ npm init -y
$ git init
```

そしでは、よくある Node の設定をしましょう。

1. `package.json` に `"private": true` のフラグをつけましょう。そうすると、事故で project
    が npm に公開されることがなくなります。
2. `author`、 `description` や `keyword` のメタデータを `package.json`
    に追加しましょう。プロジェクトの詳細が明確になります。
3. そして `node_modules` を `.gitignore` に追加しましょう。

    ```
    $ echo "node_modules" >> .gitignore
    ```

全てが完了したら、初めてのコミットをしましょう：

```sh
$ git add .; git commit -m "初めてのコミット"
```

### Github の GraphQL API の使い方

便利な [`graphql-fetch`](https://www.npmjs.com/package/graphql-fetch) パッケージと、サービスの動作をテストするために
[`tap`](https://www.npmjs.com/package/tap) パッケージをインストールしましょう。

```sh
$ npm install --save graphql-fetch isometric-fetch
$ npm install --save-dev tap
```

_(`graphql-fetch` のために `isometric-fetch` が必須です)_

Github の GraphQL 仕様はこちらです： https://api.github.com/graphql
このドキュメントによると、以下のやり方で API 経由でデータを取得できます。

_(lib/loadTeams.js)_
```js
const fetch = require('graphql-fetch')('https://api.github.com/graphql')
```

アクセスのためには [Github Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) が必要となります。
コード例では "ABCGithubIsSweetXYZ" という文字列を使ってみますが、あなたが取得したトークンを実際のコードでは利用してください。

```js
const GITHUB_TOKEN = 'ABCGithubIsSweetXYZ'
```

仕様のドキュメントに、[explorer](https://developer.github.com/early-access/graphql/explorer/) と呼ばれる便利なツールがあります。
`login` の Organization の ID をロードするために、このようなコードを書いてみましょう：

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

もちろん、テストもお忘れなく。

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

コードの実装は完了です。次に実行するためのスクリプトを設定しましょう。`package.json`
に "script" フィールドと、そのスクリプトを追加してください。

```json
"scripts": {
  "test": "tap -- test/**"
}
```

これを追加することで、これからは `$ npm test` でテストを動かすことができます。
試しに実行してみてください、問題なく動作するはずです。

## 🛠 データベースの準備
GraphQL で Github のデータをアクセスするので、データの保存にも GraphQL を活用しましょう！最近では、
GraphQL-as-as-Service のサービスもいくつかあります。今回の実験のために、Scaphold
は最適そうです。まずはアカウントを作りましょう。 Let's [create an account](https://scaphold.io/)!

_(ノート： `Scaphold` の発音は `Scaffold` と同じです)_

<img alt="スクリーンショット： Scaphold のサインアップのフォーム" src="https://i.gyazo.com/beb8ad1f4aa20c05ef7ee08196e9e823.png" width="200">

アカウントを作成すると、アプリを作ることができるようになります。

<img alt="スクリーンショット： アプリのフォーム" src="https://i.gyazo.com/e4ba1a68cb85f199f302f34ea93c13a2.png" width="370">

<img alt="スクリーンショット： アプリの情報" src="https://i.gyazo.com/fd45405742040ab3f495bb37e8510c3c.png" width="380">

アプリを作成したら、その Type を設定しましょう。少しだけ MySQL のテーブルの設定に似ています：

<img alt="スクリーンショット： Scaphold の "Add Type" のボタン" src="https://i.gyazo.com/4e164a5fe0799e620afec5b9a3f9e5f9.png" width="200">

このような Schema を設定してください [`./scaphold.schema`](./scaphold.schema)
_([`./scaphold.schema.json`](./scaphold.schema.json) は私の Schema のエキスポートしたファイルです)_.

このデータ Schema で、チームのデータを保存できるようになりました。アプリの作成が完了したら、
Scapholdが API を用意してくれます：

<img alt="スクリーンショット： Scaphold の "API link" ディスプレイ" src="https://i.gyazo.com/5708b34eaea0be439ec52c7eee289b1a.png" width="260">

**データベースをゲッツ!** 🎉

Scaphold は API だけではなく、API エクスプローラも用意しています。詳細は[こちら](https://us-west-2.api.scaphold.io/graphql/zei-sca-git)。

### 🔒 セキュリティ

Scaphold のデフォルトでは、誰でも全てのデータを変更できます。設定で管理者以外の変更制限をつける
ことが可能です。

<img alt="スクリーンショット： Scaphold の許可ボタン" src="https://i.gyazo.com/16178c98310436c17757cf8dfa3b7fe0.png" width="80">

"Everyone" が "read only" になるように制限を追加しましょう。

<img alt="スクリーンショット： Read のみの許可" src="https://i.gyazo.com/9c3ac80281829b72b6d7e841569de7a0.png" width="200">

### 💾 データを保存しましょう

GraphQL は、データをアクセスするのためだけに使うではなく、データを更新するためにも使えます！ GraphQL
ではその変更のことを ["Mutation"](http://graphql.org/learn/queries/#mutations) と呼びます。

テストを書くのに、データを自由に変更できるようにしましょう。そのためには、"Admin Token" が必要となります。

<img alt="スクリーンショット： 設定の Admin Token のセクション" src="https://i.gyazo.com/ed4d09d71682846b10e77f690a805659.png" width="500">

実装例として今回は "ABCScapholdForTheWinXYZ" を使いますが、
実際のコードではあなたが取得したトークンを利用してください。
では、[GraphQL mutation API](https://scaphold.io/docs/#mutations) を使いましょう！

_(lib/teamCRUD.js)_
```javascript
require('isomorphic-fetch')

const fetch = require('graphql-fetch')(
  'https://us-west-2.api.scaphold.io/graphql/zei-sca-git'
)
const SCAPHOLD_TOKEN = 'ABCScapholdForTheWinXYZ'
const HEADERS = {
  headers: new Headers({
    Authorization: `bearer ${SCAPHOLD_TOKEN}`
  })
}

exports.create = team =>
  fetch(`
    mutation CreateTeam($team: CreateTeamInput!) {
      createTeam(input: $team) {
        changedTeam {
          id
          slug
          privacy
          name
        }
      }
    }
  `, { team }, HEADERS).then(result => result.data && result.data.createTeam.changedTeam)

exports.read = id =>
  fetch(`
    query ReadTeam($id: ID!) {
      getTeam(id: $id) {
        id
        slug
        privacy
        name
      }
    }
  `, { id }, HEADERS).then(result => result.data && result.data.getTeam)

exports.update = team =>
  fetch(`
    mutation UpdateTeam($team: UpdateTeamInput!) {
      updateTeam(input: $team) {
        changedTeam {
          id
          slug
          privacy
          name
        }
      }
    }
  `, { team }, HEADERS).then(result => result.data && result.data.updateTeam.changedTeam)

exports.del = id =>
  fetch(`
    mutation DeleteTeam($team: DeleteTeamInput!) {
      deleteTeam(input: $team) {
        changedTeam { slug }
      }
    }
  `, { team: { id } }, HEADERS).then(result => (result.data && result.data.deleteTeam) ? true : false)

```

上の４つの関数を以て、CRUD な API の実装が完了しました。もちろん、テストも書けます！

_(test/teamCRUD.js)_
```javascript
const { test } = require('tap')
const { create, read, update, del } = require('../lib/teamCRUD.js')

test('create, read, update and delete a team', t => {
  let id
  let slug = 'abcd' + Math.random().toString(32)
  return create({
    name: 'ABCD',
    slug: slug,
    privacy: 'VISIBLE'
  }).then(team => {
    t.notEquals(team, null)
    t.equals(team.name, 'ABCD')
    t.equals(team.slug, slug)
    t.equals(team.privacy, 'VISIBLE')
    t.notEquals(team.id)
    id = team.id
    return read(id)
  }).then(team => {
    t.notEquals(team, null)
    t.equals(team.id, id)
    t.equals(team.name, 'ABCD')
    team.name = 'EFGH'
    return update(team)
  }).then(team => {
    t.notEquals(team, null)
    t.equals(team.id, id)
    t.equals(team.name, 'EFGH')
    return read(id)
  }).then(team => {
    t.notEquals(team, null)
    t.equals(team.id, id)
    t.equals(team.name, 'EFGH')
    return del(id)
  }).then(successful => {
    t.equals(successful, true)
    return read(id)
  }).then(team => {
    t.equals(team, null)
  })
})

```

**やった！データを保存できるようになった！**  🎉

## 🚀 サーバーのセットアップ

ストレージや Github の API を完了したので、そろそろ実際に使ってみましょう。
ただ、その前に全ての変数を環境変数に変更しましょう😅
そうしないと Zeit へデプロイした後に、誰でもトークンなどの情報にアクセスすることが可能となってしまいます。。

### 🔑 準備：環境変数

Node の `process.env` を使い、`GITHUB_TOKEN` や `SCAPHOLD_TOKEN` をこのように
環境変数に書き換えます。

```javascript
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
if (!GITHUB_TOKEN) {
  throw new Error('Please specify the GITHUB_TOKEN environment variable')
}
```

そして、テストをこのように実行するように変更しましょう：

```bash
$ env GITHUB_TOKEN=ABCGithubIsSweetXYZ \
      SCAPHOLD_TOKEN=ABCScapholdForTheWinXYZ \
      npm test
```

### 🏴 軽いサーバ

同期処理を行うために、小さいサーバを用意します。

_(index.js)_
```javascript
const { createServer } = require('http')
const SECRET = '/secret'
const server = createServer((req, res) => {
  if (req.url === SECRET && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('you found me!')
    return
  }
  res.writeHead(404, {'Content-Type': 'text/plain'})
  res.end('not found')
})
server.listen( () => {
  const address = server.address()
  const host = address.address === '::' ? 'localhost' : address.address
  console.log(`Server started on http://${host}:${address.port}`)
})
```

`node index.js` でサーバを起動できるようになりました。`/secret` 以外へのリクエストは `404` を返します。

このセットアップを少し綺麗にしましょう。`package.json` に `start` のスクリプトを追加しましょう：

```json
"scripts": {
  "test": "tap -- test/**",
  "start": "node index.js"
}
```

こうすることで、`npm start` を実行するだけでサーバーが立ち上がるようになります。

### 🏳 `now` で起動

`now` を使うためにまずは `now` をインストールする必要があります：

```bash
$ npm install now -g
```
_(メモ；あなたの環境次第では、`sudo` を追加して実行する必要があります)_

インストールが完了したら、サーバを立ち上げるのは非常に簡単です：

```bash
$ now
```

実際にデプロイしてみたので、こちらへアクセスしてみてください：

https://zei-sca-git-iirtkazzso.now.sh/

`not found` になりました。`/secret` をアクセスすると `you found me!` が表示されます。

https://zei-sca-git-iirtkazzso.now.sh/secret

ソースコードもすでに読むことができます：

https://zei-sca-git-iirtkazzso.now.sh/_src/?f=index.js

## 🏁 全てを繋げましょう

### 1.) 全てのデータをロードしよう

`./lib/loadTeams.js` は全てのチームデータをまだロードしていません。API で全てのデータが出るようにしましょう：

_(lib/loadTeams)_
```javascript
query Organization ($login: String!) {
  organization(login: $login) {
    id
    teams(first: 30) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          name
          privacy
          slug
        }
      }
    }
  }
}
```

これで、リクエストごとに必要なチームのデータを取得することができます。

### 2.) データをサーバに保存しましょう

`/secret` のパスにアクセスした際に、Sync を実行します。

```javascript
const sync = require('./lib/sync.js')
const GITHUB_ORG = 'nodeschool'
// ...
  if (req.url === SECRET && req.method === 'GET') {
    sync(GITHUB_ORG).then(() => {
      //..
    }).catch((e) => {
      res.write(500, {'Content-Type': 'text/plain'})
      res.end(e.stack || e.toString())
    })
    return
  }
```

全てのシステムを書くには時間が足りないので、今回はチームのデータを保存するのみにしましょう。

さらに実装を簡単にするために [bluebird](http://bluebirdjs.com/docs/getting-started.html) を使いましょう。

```bash
$ npm i bluebird --save
```

_(lib/sync.js)_
```javascript
const { map } = require('bluebird')
const loadTeams = require('./loadTeams.js')
const { create } = require('./teamCRUD.js')
const running = {}

module.exports = login => {
  if (running[login]) {
    // 今のプロセスを使います。DDOS の防止。
    return running[login]
  }
  return running[login] = loadTeams(login)
    .then((result) => {
      var teams = result
        .data.organization.teams.edges
        // `node` が必要です
        .map(edge => edge.node)
        // 見えるチームのみ
        .filter(team => team.privacy !== 'SECRET')

      return map(
        teams,
        // エラーを無視します
        team => create(team).catch(e => null),
        // Scaphold への DDOS 防止
        { concurrency: 5 }
      )
    })
    .then(result => {
      delete running[login]
      return result
    })
}
```

このように `/secret` をアクセスすると、全てのチームを Github から Scaphold へ Sync していきます。

### 3.) セキュアに起動

`GITHUB_ORG` と `SECRET` も、`GITHUB_TOKEN` と同じように環境変数で設定しましょう。

```javascript
const SECRET = '/' + process.env.SECRET
if (!SECRET) {
  throw new Error('Please specify the SECRET environment variable')
}
```

これで、下記の４つの変数がサーバーの起動時に必要となります：

- `SECRET`
- `GITHUB_ORG`
- `GITHUB_TOKEN`
- `SCAPHOLD_TOKEN`

環境変数を設定するには `now` の実行時に追加するだけです：

```bash
$ now -e SECRET=secret \
      -e GITHUB_ORG=nodeshool \
      -e GITHUB_TOKEN=ABCGithubIsSweetXYZ \
      -e SCAPHOLD_TOKEN=ABCScapholdForTheWinXYZ
```

最終的にサーバーが動いているかどうかは、このコマンドで簡単確認できます：

```bash
$ curl https://zei-sca-git-yhyfypszsj.now.sh/secret
```

🤓 イェー! できました！ ✋🏽

公開 API を閲覧するためは [こちらへ](https://us-west-2.api.scaphold.io/graphql/zei-sca-git?query=query%20%7B%0A%20%20viewer%20%7B%0A%20%20%20%20allTeams%20%7B%0A%20%20%20%20%20%20edges%20%7B%0A%20%20%20%20%20%20%20%20node%20%7B%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20slug%0A%20%20%20%20%20%20%20%20%20%20privacy%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)。

## 🤔 まとめ

この記事で紹介したように、GraphQL は開発の未来を少し明るく照らしそうです。
Schema のスペックに簡単にアクセスできるのは非常に便利で、 Scaphold
のようなサービスは使ってみると意外と体に馴染みます。また、Zeit のようなマイクロサービス
と繋いで使ってみるのも、簡単で早く、オープンにアクセスできますし、何よりもロックインされた独自
な技術を使わなくて良いのは最高です🤑

この記事で紹介した全てのコードは [Github](https://github.com/martinheidegger/zei-sca-git) にホストしてあります。
[NodeSchool](https://nodeschool.io/) を通じて誰でも簡単に学べるようにするために、この Repository を最適化するPRを頂けたら幸いです！
