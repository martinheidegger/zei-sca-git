const { createServer } = require('http')
const sync = require('./lib/sync.js')
const SECRET = '/' + process.env.SECRET
if (!SECRET) {
  throw new Error('Please specify the SECRET environment variable')
}
const GITHUB_ORG = process.env.GITHUB_ORG
if (!GITHUB_ORG) {
  throw new Error('Please specify the GITHUB_ORG environment variable')
}
const server = createServer((req, res) => {
  if (req.url === SECRET && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.write(`You found me!\nSyncing ${GITHUB_ORG}...\n`)
    sync(GITHUB_ORG).then(() => {
      res.end('... synced!')
    }).catch((e) => {
      res.write('... error!\n')
      res.end(e.stack || e.toString())
    })
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
