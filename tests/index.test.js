const supertest = require('supertest')

const Server = require('../server')
const originalConfig = require('../config')

const dbImporter = require('../dev/importer')

// modify test config
const port = originalConfig.app.port + 1
const database = `${originalConfig.mysql.database}_test`
const config = {
  ...originalConfig,
  mysql: { ...originalConfig.mysql, database },
  app: { ...originalConfig.app, port }
}

describe('server', async () => {
  let app, request
  beforeAll(async () => {
    await dbImporter.dropDb(config.mysql)
    await dbImporter.createDB(config.mysql)
    await dbImporter.createTables(config.mysql)

    const server = new Server(config)
    await server.init()

    app = server.server
    request = supertest(app)

    return server
  })

  test('should GET / return 200', async () => {
    const response = await request.get('/')
    expect(response.status).toEqual(200)
  })
})
