# ⏱ Zei - 🏢 Sca - 😺 Git
[zeit/now](https://zeit.co/now) - [scaphold](https://scaphold.io) -  [github](https://developer.github.com)

今日は入りやすいモダーンやオープンな技術を利用するちっちゃなさサービスを書きましょう！

## 💡 コンゼプト

### 問題
このサービスで対応したいのは Github の問題です。実は Github の Organization は "public"な
チームがありますが、Organization 以外のかたはそのチームを見えません。

例えば、ログインしていない場合または NodeSchool のメンバーじゃない場合では
[NodeSchool のページ](https://github.com/nodeschool)にはチームタブがありません。その
タブの内容は誰でも見えるようにしたいです。

### 解決
対応するためにちっちゃな Node.js サーバーを書きましょう。そのサーバーは Github からのチーム
を読んでデータベースに保蔵んして、誰でもアクセスできるようにしています。

### CPU & Memory
[Zeit/now](https://zeit.co/now) は無料の CPU をオーペンソースのプロジェクトんにオファー
しています。その上は Zeit のデプロイシステムはめっちゃ簡単なので絶対便利になるでしょう。

### ストレージ
今までよくはやっている REST API の変われいにもうちょっと格好よく開発したいです。そのためは
[GraphQL](http://graphql.org/) の API を用意したいです。もしかしたさらにフレキシブルです。
もしかしたもっと早いです。

私たちの運がいいです。[scaphold](https://scaphold.io) というサービスは GraphQL の
データベースを少ないデータのために無料に出しています。楽しみです！
