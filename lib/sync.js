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
        // Only visible teams
        .filter(team => team.privacy !== 'SECRET')

      return map(
        teams,
        // Eat error messages
        team => create(team).catch(e => null),
        // No DDOS attack on Scaphold
        { concurrency: 5 }
      )
    })
    .then(result => {
      delete running[login]
      return result
    })
}
