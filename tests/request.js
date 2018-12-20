const supertest = require('supertest')
const config = require('./test-config')

const request = supertest(`http://localhost:${config.app.port}`)

module.exports = {
  request
}
