require('isomorphic-fetch')

const fetch = require('graphql-fetch')('https://api.github.com/graphql')
const GITHUB_TOKEN = 'ABCGithubIsSweetXYZ'

module.exports = (login) =>
  fetch(`
    query {
      organization(login: "${login}") {
        id
      }
    }
  `, null, {
    headers: new Headers({
      Authorization: `bearer ${GITHUB_TOKEN}`
    })
  })

