require('isomorphic-fetch')

const fetch = require('graphql-fetch')('https://api.github.com/graphql')
const GITHUB_TOKEN = 'ABCGithubIsSweetXYZ'

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
