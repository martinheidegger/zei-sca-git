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
