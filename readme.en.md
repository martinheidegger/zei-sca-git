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
