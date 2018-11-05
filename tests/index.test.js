const supertest = require('supertest')

const Server = require('../server')
const config = require('../config')

describe('server', async () => {
  let app, request
  beforeAll(async () => {
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
