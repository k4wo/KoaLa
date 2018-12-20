const Server = require('../server')
const config = require('./test-config')
const dbImporter = require('../dev/importer')

const globalSetup = async () => {
  await dbImporter.dropDb(config.mysql)
  await dbImporter.createDB(config.mysql)
  await dbImporter.createTables(config.mysql)

  const server = new Server(config)
  await server.init()

  global.server = server
  return server
}

module.exports = globalSetup
