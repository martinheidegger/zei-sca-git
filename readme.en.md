# ⏱ Zei - 🏢 Sca - 😺 Git
[zeit/now](https://zeit.co/now) - [scaphold](https://scaphold.io) -  [github](https://developer.github.com)

A step-by-step walk-through to build a little service that makes use of
modern, open technologies.

## 💡 Concept

### Problem
The problem that we try to solve today is that Github doesn't show the public
teams to non-organization members.

For example: if you are logged-out of Github _(or you are not a member of
NodeSchool)_ and go to the [NodeSchool page](https://github.com/nodeschool)
: it will not show the "Teams" tab.

![https://i.gyazo.com/e4defee231df714b0cc4d8b12f1f51f7.png]

For making the community clearer and giving recognition to the members in the
team we want to make the public teams visible to everyone.

### Solution
Let's write a little [Node.js](https://nodejs.org) server that fetches the teams
from Github and stores them in a database. This server then offers the data to
the public.

### CPU & Memory
[Zeit/now](https://zeit.co/now) offers free CPU for open-source projects. Not
just that: it will come in handy that setting-up process is very simple.

### Storage
Instead of a common REST API, we try to go with the times and provide a fancier
[GraphQL](http://graphql.org/) API. This is more flexible and perhaps faster.

Luckily [Scaphold](https://scaphold.io) offers a free GraphQL database as a
service.

## 😺 Github API
If you used the Github API before, you might be all like "been-there-done-that",
but **Github has an [early-access](https://developer.github.com/early-access/)
[GraphQL API](https://developer.github.com/early-access/graphql/)** which makes
this a little more exciting.

To access the API through Node, first init the project `zei-sca-git`:
_(Note: the installation of Node.js 7 & Git is assumed)_

```sh
$ mkdir zei-sca-git; cd zei-sca-git
$ npm init -y
$ git init
```

Then we take care of common node setup steps:

1. Add `"private": true` to the `package.json` to make sure we don't accidentally
    publish it prematurely.
2. Add `author`, `description` and `keyword` metadata to the `package.json` to
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
$ npm install --save graphql-fetch isomorphic-fetch
$ npm install --save-dev tap
```

_(`graphql-fetch` requires `isomorphic-fetch`)_

The GraphQL specification for Github is available at https://api.github.com/graphql
, so we can prepare the fetch call like this:

_(lib/loadTeams.js)_
```js
const fetch = require('graphql-fetch')('https://api.github.com/graphql')
```

We will also need a [Github Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
. As Placeholder let me use `'ABCGithubIsSweetXYZ'` in the examples.

```js
const GITHUB_TOKEN = 'ABCGithubIsSweetXYZ'
```

We can then use the documentation available [here](https://developer.github.com/early-access/graphql/explorer/)
to immediately test the API online.

With some reading of docs we learn to fetch an organization ID for a `login`
like this:

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

With `tap` we then simple can write tests to check if the ID is correct:

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

Now that we have the code and the tests, we just need to add the test script
to the `package.json`:

```json
"scripts": {
  "test": "tap -- test/**"
}
```

With this, we can run `$ npm test` and it should be green.

<img alt="Screenshot: Tests are green" width="464" src="https://i.gyazo.com/29eafdd7e5f45a220c6039a6d8d35154.png">

## 🛠 Prepare the Database
Since we already use GraphQL to access Github, we can go all the way and use GraphQL
to store our data as well! Recently, several "GraphQL-as-a-Service" databases
were launched. Scaphold is our choice for this experiment, so let's
[create an account](https://scaphold.io/)!

<img alt="Screenshot: Sign Up to Scaphold" src="https://i.gyazo.com/beb8ad1f4aa20c05ef7ee08196e9e823.png" width="257">

With the new account we can further create an app:

<img alt="Screenshot: Create an App" src="https://i.gyazo.com/e4ba1a68cb85f199f302f34ea93c13a2.png" width="475">

<img alt="Screenshot: App Details" src="https://i.gyazo.com/fd45405742040ab3f495bb37e8510c3c.png" width="413">

Now that we have created the app, we can specify the `Types` we would like to store.
If you have specified MySQL tables before then this might feel familiar:

<img alt="Screenshot: Add Type Button in Scaphold interface" src="https://i.gyazo.com/4e164a5fe0799e620afec5b9a3f9e5f9.png" width="197">

For today's work we need a schema that looks like [`./scaphold.schema`](./scaphold.schema)
_([`./scaphold.schema.json`](./scaphold.schema.json) is an export of the schema
I created in preparation)_.

Now that we also have the data schema, we can use the app to store our teams!
Scaphold offers a direct link to access our data storage:

<img alt="Screenshot: API link in Scaphold" src="https://i.gyazo.com/5708b34eaea0be439ec52c7eee289b1a.png" width="329">

Scaphold also allows us to immediately explore the API to the data storage with
[iGraphQL](https://us-west-2.api.scaphold.io/graphql/zei-sca-git).

**Now we have a database!** 🎉

### 🔒 Security

By default all data in Scaphold is **unprotected**. But it is possible to add a
setting that allows the modification of data only to admin users.

<img alt="Screenshot: Scaphold Permissions Button" src="https://i.gyazo.com/16178c98310436c17757cf8dfa3b7fe0.png" width="161">

Limit the permissions for `Everyone` to `read`.

<img alt="Screenshot: Permissions Read only" src="https://i.gyazo.com/9c3ac80281829b72b6d7e841569de7a0.png" width="303">

With this setting active, only admin users can edit the data.

### 💾 Store some data

We can use GraphQL not _just_ to request data. We can also change it! In GraphQL
that is called a ["Mutation"](http://graphql.org/learn/queries/#mutations).

For our test we want to be able to modify everything, specially the protected parts,
so we have to get an `Admin Token` first.

<img alt="Screenshot: Admin Token Section in settings" src="https://i.gyazo.com/ed4d09d71682846b10e77f690a805659.png" width="743">

_As placeholder let me use `'ABCScapholdForTheWinXYZ'` in the following code._

Now, Let's start using the [GraphQL mutation API](https://scaphold.io/docs/#mutations):

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

With those 4 methods we have a complete
[CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) API.
Let's immediately test this!

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
that though, let's first move all our keys to environment variables 😅. If we
keep them in the code they might become visible to everyone, and that would be
[bad](https://snyk.io/blog/leaked-credentials-in-packages/).

### 🔑 Preparation: Environment variables
We can easily use `process.env` to get the `GITHUB_TOKEN` and `SCAPHOLD_TOKEN`
like this:

```javascript
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
if (!GITHUB_TOKEN) {
  throw new Error('Please specify the GITHUB_TOKEN environment variable')
}
```

after this change we need to run the tests like this:

```bash
$ env GITHUB_TOKEN=ABCGithubIsSweetXYZ \
      SCAPHOLD_TOKEN=ABCScapholdForTheWinXYZ \
      npm test
```

### 🏴 Setup a simple Server
We **still** need a little server for the sync process. For this project
[`http.createServer`](https://nodejs.org/api/http.html#http_http_createserver_requestlistener)
that comes with Node.js is powerful enough.

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
for all pages except `/secret` _(`/secret` will show `you found me!`)_.

To clean it up a little we should add a `start` script to the `package.json`:

```json
"scripts": {
  "test": "tap -- test/**",
  "start": "node index.js"
}
```

With this script we can start the same server using `npm start`.

### 🏳 Launch it with `now`
`Zeit/now` is [PaaS](https://en.wikipedia.org/wiki/Platform_as_a_service) that
has computers running in the cloud with Node on them.

`now` be used easily through a command line tool. We need to install this tool
using:

```bash
$ npm install now -g
```
_(Note: some setups need to run this with `sudo npm install now -g`)_

Then you can start the server simply using:

```bash
$ now
```

Since I deployed this server you can look it up immediately here:

https://zei-sca-git-iirtkazzso.now.sh/

It will output `not found`. Accessing: `/secret` will show `you found me!`.

https://zei-sca-git-iirtkazzso.now.sh/secret

You can immediately look at the source code here:

https://zei-sca-git-iirtkazzso.now.sh/_src/?f=index.js

## 🏁 Connect the parts
All parts are working separately but we need to get them to work together.


### 1.) Get all data
`./lib/loadTeams.js` does not load all the data of teams yet. So, lets
change the API to return the full team object:

_(lib/loadTeams.js)_
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

Now we get the team data with every response.

### 2.) Write the data to the server

When the server gets to the secret path it should start the sync process:

_(index.js)_
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

For a the start, lets just store the teams. To make our lives a little easier
still, lets also use [bluebird](http://bluebirdjs.com/docs/getting-started.html).

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
    // Return currently running process if not-yet finished, DDOS prevention
    return running[login]
  }
  return running[login] = loadTeams(login)
    .then((result) => {
      var teams = result
        .data.organization.teams.edges
        // We only need the node
        .map(edge => edge.node)
        // Hide secret teams
        .filter(team => team.privacy !== 'SECRET')

      return map(
        teams,
        // Eat error messages
        team => create(team).catch(e => null),
        // Limit the requests to 5 parallel, to prevent us accidentally DDOSing
        // Scaphold
        { concurrency: 5 }
      )
    })
    .then(result => {
      delete running[login]
      return result
    })
}
```

Accessing the server at `/secret` will sync all the teams from Github to Scaphold.

### 3.) Start with secrets

We have to extract the `GITHUB_ORG` configuration constant and the `SECRET` constant
same like we did with `GITHUB_TOKEN` to make sure that only people we know
can update the database.

```javascript
const SECRET = '/' + process.env.SECRET
if (!SECRET) {
  throw new Error('Please specify the SECRET environment variable')
}
```

After that we need 4 variables to start our server:

- `SECRET`
- `GITHUB_ORG`
- `GITHUB_TOKEN`
- `SCAPHOLD_TOKEN`

Abd we can easily start `now` with those variables.

```bash
$ now -e SECRET=secret \
      -e GITHUB_ORG=nodeshool \
      -e GITHUB_TOKEN=ABCGithubIsSweetXYZ \
      -e SCAPHOLD_TOKEN=ABCScapholdForTheWinXYZ
```

The server should be running and we can sync the data simply by opening:

```bash
$ curl https://zei-sca-git-yhyfypszsj.now.sh/secret
```

🤓 We did it! High Five! ✋🏽

You can explore the public API [here](https://us-west-2.api.scaphold.io/graphql/zei-sca-git?query=query%20%7B%0A%20%20viewer%20%7B%0A%20%20%20%20allTeams%20%7B%0A%20%20%20%20%20%20edges%20%7B%0A%20%20%20%20%20%20%20%20node%20%7B%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20slug%0A%20%20%20%20%20%20%20%20%20%20privacy%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D).

## 🤔 Summary

GraphQL as a method is bound to make our lives easier. The transportable
schema definitions and new GraphQL services like Scaphold work surprisingly well.
Combined with a　microservice architecture like `Zeit/now` we should be able to
create quickly, very useful open database while being much less dependent on the
whims of Proprietary technologies. 🤑

All this code is hosted on [Github](https://github.com/martinheidegger/zei-sca-git).

_I hope you enjoyed it!_

One final note: For NodeSchool, it would be super awesome if we could turn this
into concept or prototype into a full-fletched syncing server.
