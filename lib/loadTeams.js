require('isomorphic-fetch')

const fetch = require('graphql-fetch')('https://api.github.com/graphql')
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
if (!GITHUB_TOKEN) {
  throw new Error('Please specify the GITHUB_TOKEN environment variable')
}

module.exports = (login) =>
  fetch(`
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
              description
              slug
              id
            }
          }
        }
      }
    }
  `, { login: 'nodeschool' }, {
    headers: new Headers({
      Authorization: `bearer ${GITHUB_TOKEN}`
    })
  })
