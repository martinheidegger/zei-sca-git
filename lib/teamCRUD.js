require('isomorphic-fetch')

const fetch = require('graphql-fetch')(
  'https://us-west-2.api.scaphold.io/graphql/zei-sca-git'
)
const SCAPHOLD_TOKEN = process.env.GITHUB_TOKEN
if (!SCAPHOLD_TOKEN) {
  throw new Error('Please specify the GITHUB_TOKEN environment variable')
}
const HEADERS = {
  headers: new Headers({
    Authorization: `Bearer ${SCAPHOLD_TOKEN}`
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
  `, { team }, HEADERS).then(result =>
    result.data && result.data.createTeam && result.data.createTeam.changedTeam
  )

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
  `, { team }, HEADERS).then(result => result.data && result.data.updateTeam && result.data.updateTeam.changedTeam)

exports.del = id =>
  fetch(`
    mutation DeleteTeam($team: DeleteTeamInput!) {
      deleteTeam(input: $team) {
        changedTeam { slug }
      }
    }
  `, { team: { id } }, HEADERS).then(result => (result.data && result.data.deleteTeam) ? true : false)
