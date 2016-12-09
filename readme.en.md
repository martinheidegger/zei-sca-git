# ⏱ Zei - 🏢 Sca - 😺 Git
[zeit/now](https://zeit.co/now) - [scaphold](https://scaphold.io) -  [github](https://developer.github.com)

Today we are trying to build a little service that makes use of modern, open
technologies that should be easy to get started.

## 💡 Concept

### Problem
Todays problem that we try to solve is that Github doesn't show the public teams
to non-organization members.

For example, if you are logged-out of github or are not a member of
NodeSchool and go to the [NodeSchool page](https://github.com/nodeschool)
it will not show the "Teams" tab. However for publicity reasons we want to
make the public teams visible to everyone.

### Solution
We write a little Node.js server that fetches the teams from Github and stores
it in a database it also later offers the data to the public.

### CPU & Memory
[Zeit/now](https://zeit.co/now) offers free CPU to open-source projects. Not
just that: the deployment process is very simple so it comes in handy.

### Storage
Instead of a common REST API we think we are cool and want to provide a fancier
[GraphQL](http://graphql.org/) API which is more flexible and perhaps faster.

Luckily [scaphold](https://scaphold.io) offers a service that allows to use
a GraphQL database for free. This should make our code very easy.

## 😺 Github API
If you used the Github API before you might think this is old stuff, but
**Github has an [early-access](https://developer.github.com/early-access/)
[GraphQL API](https://developer.github.com/early-access/graphql/)**.

To access the API through node, first init the project `zei-sca-git`:
_(Note: the installation of Node & Git is assumed)_

```sh
$ mkdir zei-sca-git; cd zei-sca-git
$ npm init -y
$ git init
```

Then we take care of common node steps:

1. Add `"private": true` to the package.json to make sure we don't accidentally
    publish it prematurely.
2. Add `author`, `description` and `keyword` metadata to the package.json to
    be clear about our intent.
3. Make sure that the `node_modules` folder is part of `.gitignore`

    ```
    $ echo "node_modules" >> .gitignore
    ```

Then finish our commit:

```sh
$ git add .; git commit -m "initial commit"
```

### Use the GraphQL Github API in Node

Lets first install the [`graphql-fetch`](https://www.npmjs.com/package/graphql-fetch)
package and add [`tap`](https://www.npmjs.com/package/tap) to test our progress.

```sh
$ npm install --save graphql-fetch isometric-fetch
$ npm install --save-dev tap
```

_(`graphql-fetch` requires `isometric-fetch`)_

The GraphQL specification for github is: https://api.github.com/graphql so we
can prepare the fetch call like this:

_(lib/loadTeams.js)_
```js
const fetch = require('graphql-fetch')('https://api.github.com/graphql')
```

We will need a [Github Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
. As Placeholder let me use "ABCGithubIsSweetXYZ" in the examples.

```js
const GITHUB_TOKEN = 'ABCGithubIsSweetXYZ'
```

We can then use the documentation available [here](https://developer.github.com/early-access/graphql/explorer/)
to fetch an organization ID for a `login`:

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

and in the tests we simply check if the id is correct:

_(../test/loadTeams.js)_
```js
const { test } = require('tap')
const loadTeams = require('../lib/loadTeams.js')

test('get organization id', t =>
  loadTeams('nodeschool').then(result => {
    t.equals(result.data.organization.id, 'MDEyOk9yZ2FuaXphdGlvbjU0Mzc1ODc=')
  })
)
```

Now that we have the code and the tests we just need to add the scripts
to the `package.json`.

```json
"scripts": {
  "test": "tap -- test/**"
}
```

Then we can run `$ npm test` and we it should be green.
