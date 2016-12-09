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

## 🛠 Prepare the Database
Since we use GraphQL to access Github, for this experiment we use GraphQL to
store our data as well! Recently GraphQL as a service databases services appeared.
Scaphold is our choice for this experiment. Let's
[create an account](https://scaphold.io/)!

<img alt="Screenshot: Sign Up to Scaphold" src="https://i.gyazo.com/ae41d9f25669b1069e281153e26a3e2b.png" width="200">

Once you created an account you can create an application:

<img alt="Screenshot: Create an App" src="https://i.gyazo.com/e4ba1a68cb85f199f302f34ea93c13a2.png" width="370">

<img alt="Screenshot: App Details" src="https://i.gyazo.com/fd45405742040ab3f495bb37e8510c3c.png" width="380">

Now that we have created the app we can specify the Types we want to
store. This is a little bit like a MySQL table specification:

<img alt="Screenshot: Add Type Button in Scaphold interface" src="https://i.gyazo.com/4e164a5fe0799e620afec5b9a3f9e5f9.png" width="200">

Define a scheme like in [`./scaphold.schema`](./scaphold.schema)
_([`./scaphold.schema.json`](./scaphold.schema.json) is an export of my schema)_.

Now that we also have the data schema we can use it to store our teams. Scaphold immediately offers a link for it:

<img alt="Screenshot: API link in Scaphold" src="https://i.gyazo.com/5708b34eaea0be439ec52c7eee289b1a.png" width="260">

**Now we have a database!** 🎉

Scaphold immediately creates an API explorer with all the documentation for us:
[here](https://us-west-2.api.scaphold.io/graphql/zei-sca-git).

### 🔒 Security

By default all data in Scaphold is unprotected. You can add a setting to allow
only admin users to modify data.

<img alt="Screenshot: Scaphold Permissions Button" src="https://i.gyazo.com/16178c98310436c17757cf8dfa3b7fe0.png" width="80">

Limit the permissions for "Everyone" to "read"

<img alt="Screenshot: Permissions Read only" src="https://i.gyazo.com/9c3ac80281829b72b6d7e841569de7a0.png" width="200">

### 💾 Store some data

GraphQL does not just allow to request data, we can also modify it! In GraphQL
that is called ["Mutation"](http://graphql.org/learn/queries/#mutations).

For our test we want to be able to modify everything so we have to get an
"Admin Token" first.

<img alt="Screenshot: Admin Token Section in settings" src="https://i.gyazo.com/ed4d09d71682846b10e77f690a805659.png" width="500">

As Placeholder let me use "ABCScapholdForTheWinXYZ" in the examples.
Now, Lets start using the [GraphQL mutation API](https://scaphold.io/docs/#mutations).

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

With those 4 methods we have a complete CRUD API specification.
We can immediately test this!

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

**Yeah! Now we can store data!**  🎉

## 🚀 Setup a Server

Now that we have storage and purpose we need to start using it! Before we do
that though lets first move all our keys to environment variables 😅, if we
keep them in the code it will be deployed to Zeit.

### 🔑 Preparation: Environment variables

We can easily use `process.env` to get the `GITHUB_TOKEN` and `SCAPHOLD_TOKEN`
like this:

```javascript
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
if (!GITHUB_TOKEN) {
  throw new Error('Please specify the GITHUB_TOKEN environment variable')
}
```

in our tests we can then run:

```bash
$ env GITHUB_TOKEN=ABCGithubIsSweetXYZ \
      SCAPHOLD_TOKEN=ABCScapholdForTheWinXYZ \
      npm test
```

### 🏴 Setup a simple Server

We do still need a little server for the sync process.

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

With `node index.js` we can start the server and it will show a `404` error message
for all pages except `/secret`.

To clean it up a little we should add a `start` script to the `package.json`:

```json
"scripts": {
  "test": "tap -- test/**",
  "start": "node index.js"
}
```

With this script we can start the same server using `npm start`.

