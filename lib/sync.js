const { map } = require('bluebird')
const loadTeams = require('./loadTeams.js')
const { create } = require('./teamCRUD.js')

module.exports = (login) =>
  loadTeams(login).then((result) => {
    var teams = result.data.organization.teams.edges
    return map(teams, team => create(team).catch(e => null))
  })
