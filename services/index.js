const MySQL = require('./mysql')

module.exports = () => async app => {
  const db = new MySQL(app.config.mysql)
  db.init()

  return {
    db
  }
}
