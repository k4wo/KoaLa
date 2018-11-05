const Server = require('./server')
const config = require('./config')

const runServer = async () => {
  const server = new Server(config)

  await server.init()
  return server.server
}

module.exports = runServer()
