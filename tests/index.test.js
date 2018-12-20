const { request } = require('./request')

describe('server', async () => {
  test('should GET / return 200', async () => {
    const response = await request.get('/')
    expect(response.status).toEqual(200)
  })
})
