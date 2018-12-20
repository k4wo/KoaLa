const config = require('../config')

// modify test config
const port = config.app.port + 1
const database = `${config.mysql.database}_test`

module.exports = {
  ...config,
  mysql: { ...config.mysql, database },
  app: { ...config.app, port }
}
