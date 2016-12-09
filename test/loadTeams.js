const { test } = require('tap')
const loadTeams = require('../lib/loadTeams.js')

test('get organization id', t =>
  loadTeams('nodeschool').then(result => {
    t.equals(result.data.organization.id, 'MDEyOk9yZ2FuaXphdGlvbjU0Mzc1ODc=')
    t.ok(Array.isArray(result.data.organization.teams.edges))
  })
)

